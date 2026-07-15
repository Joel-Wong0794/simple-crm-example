// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);

    // Save to localStorage
    localStorage.setItem("user",JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user")
  };

  const hasRole = (role) => {
    return user?.role === role;
  };
  const contextValue = { user, login, logout, hasRole };
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}