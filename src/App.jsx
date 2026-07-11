// src/App.jsx
import { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { CustomerContext } from "./contexts/CustomerContext";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import CustomerCard from "./components/CustomerCard";
import CustomerDetail from "./components/CustomerDetail";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import "./App.css";

const ALL_TAGS = ["VIP", "Lead", "Referral"];

function App() {
  const { user } = useContext(AuthContext);
  const {
    filteredCustomers,
    loading,
    error,
    submitting,
    showForm,
    searchTerm,
    statusFilter,
    selectedId,
    addCustomer,
    toggleForm,
    setSearchTerm,
    setStatusFilter,
    setSelectedId,
  } = useContext(CustomerContext);

  if (!user) return <LoginPage />;
  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    tags: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      phone: form.phone,
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await addCustomer(newCustomer);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "active",
      tags: [],
    });
  };

  return (
    <div className="simple-crm">
      <Header />

      <button className="toggle-form-btn" onClick={toggleForm}>
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
              placeholder="e.g. sarah@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              placeholder="e.g. +65 9123 4567"
              value={form.phone}
              onChange={handleChange}
            />
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
          <div className="form-field">
            <label>Tags</label>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="filter-bar">
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                className={`filter-btn${statusFilter === f ? " filter-btn-active" : ""}`}
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="customer-list">
            <h2>Customers ({filteredCustomers.length})</h2>
            {filteredCustomers.length === 0 ? (
              <p className="status-message">
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
                    onSelect={setSelectedId}
                    isSelected={selectedId === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <CustomerDetail selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;