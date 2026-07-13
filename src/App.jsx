import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import "./App.css";
import NewCustomerPage from "./pages/NewCustomerPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import EditCustomerPage from "./pages/EditCustomerPage";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      {/* Routes Definition */}
      <Routes>
        {/* user accesses "/" - root path */}
        <Route index element={<WelcomePage />} />
        {/* /login */}
        <Route path="login" element={<div>Login page coming soon</div>} />

        {/* Parent Route */}

        {/* path /app */}
        {/* "/"  + "app" = "/app" */}
        <Route path="app" element={<RootLayout />}>
          {/* Child Routes/Nested Routes */}
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<NewCustomerPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="customers/:id/edit" element={<EditCustomerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;