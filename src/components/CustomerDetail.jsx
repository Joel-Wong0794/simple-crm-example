import { useState, useEffect } from "react";
import { API_BASE } from "../App";
import styles from "./CustomerDetail.module.css";
import Spinner from "./Spinner";

function CustomerDetail({ selectedId }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedId) return;

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(`${API_BASE}/customers/${selectedId}`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [selectedId]);

  // Conditional rendering
  if (!selectedId) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Select a customer to view details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Error: {error}</p>
      </div>
    );
  }

  if (loading || !customer) {
    return (
      <div className={styles.panel}>
        <Spinner size={8} />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.name}>
        {customer.firstName} {customer.lastName}
      </h2>
      {customer.company && <p className={styles.company}>{customer.company}</p>}

      <div>
        <p className={styles.contactRow}>{customer.email}</p>
        {customer.phone && (
          <p className={styles.contactRow}>{customer.phone}</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Status and tags</p>
        <div className={styles.tags}>
          <span
            className={`${styles.badge} ${customer.status === "active" ? styles.badgeActive : styles.badgeInactive}`}
          >
            {customer.status}
          </span>
          {customer.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Notes</p>
        {customer.notes ? (
          <p className={styles.notes}>{customer.notes}</p>
        ) : (
          <p className={styles.notesEmpty}>No notes yet.</p>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Customer since</p>
        <p className={styles.contactRow}>{customer.createdAt}</p>
      </div>
    </div>
  );
}

export default CustomerDetail;