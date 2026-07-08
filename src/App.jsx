import { useState, useEffect, useContext, useReducer } from "react";

import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import CustomerDetail from "./components/CustomerDetail";
import Spinner from "./components/Spinner";
import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import { customerReducer, initialState } from "./reducers/customerReducer";

const ALL_TAGS = ["VIP", "Lead", "Referral"];

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  tags: [],
  status: "active",
};

export const API_BASE = "http://localhost:3001";

function App() {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { customers, loading, error, submitting, showForm } = state;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const activeCount = customers.filter((c) => c.status === "active").length;

  const filteredCustomers = customers.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const loadCustomers = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        // fake delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(`${API_BASE}/customers`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    loadCustomers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => {
      const updatedCopy = { ...prev, [e.target.name]: e.target.value };
      return updatedCopy;
    });
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      dispatch({ type: "DELETE_CUSTOMER", payload: customerId });

      if (selectedId === customerId) {
        setSelectedId(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    dispatch({ type: "ADD_START" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Failed to add customer: ${response.status}`);
      }

      const created = await response.json();
      dispatch({ type: "ADD_CUSTOMER", payload: created });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        tags: [],
        status: "active",
      });
    } catch (err) {
      dispatch({ type: "ADD_ERROR" });
      alert(err.message);
    }
  };

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.status}`);
      }

      const updated = await response.json();
      dispatch({ type: "UPDATE_CUSTOMER", payload: updated });
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <LoginPage />;
  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="simple-crm">
      <Header />
      <button
        className="toggle-form-btn"
        onClick={() => dispatch({ type: "TOGGLE_FORM" })}
      >
        {showForm ? "Cancel" : "Add Customer"}
      </button>
      {showForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          <h3>Add New Customer</h3>

          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. Sarah"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Chen"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sarah.chen@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Tags</label>
            <div className="tag-options">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

          <div className="customer-list">
            <h2>
              Customers ({filteredCustomers.length} / {customers.length}) -{" "}
              {activeCount} total active customers
            </h2>

            {filteredCustomers.length === 0 ? (
              <p className="empty-state">
                {searchTerm
                  ? "No customers match your search."
                  : "No customers yet. Add one above!"}
              </p>
            ) : (
              <div className="customers">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                    onSelect={setSelectedId}
                    isSelected={selectedId === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CustomerDetail
          selectedId={selectedId}
          onUpdate={handleUpdateCustomer}
        />
      </div>
    </div>
  );
}

export default App;
