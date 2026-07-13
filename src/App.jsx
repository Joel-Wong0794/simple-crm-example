import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import NewCustomerPage from "./pages/NewCustomerPage";
import "./App.css";

export const API_BASE = "http://localhost:3001";

function App() {
  return (
    <BrowserRouter>
      {/* Routes Definition */}
      <Routes>
        {/* user accesses "/" */}
        <Route index element={<WelcomePage />} />
        {/* /login */}
        <Route path="login" element={<div>Login page coming soon</div>} />

        {/* Parent Route */}
        <Route path="app" element={<RootLayout />}>
          {/* Child Routes/Nested Routes */}
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
      <Route path="app" element={<RootLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<NewCustomerPage />} />
      </Route>;
      </Routes>
    </BrowserRouter>
  );
}

export default App;
