// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>,
);