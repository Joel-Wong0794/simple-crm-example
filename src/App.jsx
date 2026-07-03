import { useState } from "react";
import { mockCustomers, generateCustomerId } from "./mockData";
import "./App.css";
import CustomerCard from "./components/CustomerCard";

function App() {
  const [customers, setCustomers] = useState(mockCustomers);
  const ALL_TAGS = ["VIP", "Lead", "Referral"];
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");

  // Use an object to manage form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tags: [],
    status: "active",
  });

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

  // function handleDeleteCustomer
  const handleDeleteCustomer = (customerId) => {
    // Returns a new array with the customer with customerId filtered out
    setCustomers(customers.filter((c) => c.id !== customerId));
    // can also updater function
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

    setCustomers([...customers, newCustomer]);
    setForm({ firstName: "", lastName: "", email: "", tags: [] });
      };

  return (
    <div className="simple-crm">
      <h1>Simple CRM</h1>

      <form onSubmit={handleAddCustomer} className="add-customer-form">
        <h3>Add New Customer</h3>

        <div className="form-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="e.g. Sarah"
            // value={firstName}
            value={form.firstName}
            // onChange={(e) => setFirstName(e.target.value)}
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
            // value={lastName}
            value={form.lastName}
            // onChange={(e) => setLastName(e.target.value)}
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

      <div className="customer-list">
        <h2>Customers ({customers.length})</h2>

        <div className="customers">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDeleteCustomer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
