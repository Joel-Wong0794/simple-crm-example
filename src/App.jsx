import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import RootLayout from "./layouts/RootLayout";

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
          <Route index element={<div>Dashboard coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
