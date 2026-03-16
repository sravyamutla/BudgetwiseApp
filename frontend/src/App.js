import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Export from "./pages/Export";
import Community from "./pages/Community";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* First page when app opens */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Public pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected app pages */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budget" element={<Budget />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="export" element={<Export />} />
          <Route path="community" element={<Community />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;