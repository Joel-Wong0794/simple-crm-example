import { useState } from "react";

import { mockCustomers, generateCustomerId } from "./mockData";
import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import "./App.css";
import CustomerDetail from "./components/CustomerDetail";

const ALL_TAGS = ["VIP", "Lead", "Referral"];

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  tags: [],
  status: "active",
};

function App() {
  const [showForm, setShowForm] = useState(false)
  const [customers, setCustomers] = useState(mockCustomers);
  const [form, setForm] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter((c) =>
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const activeCustomerCount = customers.filter((c) =>
    c.status == "active",
  ).length;

  const handleChange = (e) => {
    // if(e.target.name === "firstName") {
    //   if(e.target.value === "a") alert("name cannot have a")
    // }

    setForm((prev) => {
      // [e.target.name] will evaluate to become "firstName", "lastName"
      const updatedCopy = { ...prev, [e.target.name]: e.target.value };
      return updatedCopy;
    });
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
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

  const handleAddCustomer = (e) => {
    e.preventDefault();

    const newCustomer = {
      id: generateCustomerId(),
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

    // Add new customer to the customers list
    setCustomers([...customers, newCustomer]);
    setForm(initialFormState);
  };

  return (
    <div className="simple-crm">
      <h1>Simple CRM</h1>
      <button
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
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
            // value={email}
            value={form.email}
            // onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="submit-button">
          Add Customer
        </button>
      </form>
    )}
      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <CustomerDetail customer={selectedCustomer} />
          <div className="customer-list">
            <h2>
              Customers (
              {searchTerm
                ? `Showing ${filteredCustomers.length} of ${customers.length}`
                : customers.length}
              ) - {activeCustomerCount} Total Active Customers
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
                    onSelect={setSelectedCustomer}
                    isSelected={selectedCustomer?.id === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;