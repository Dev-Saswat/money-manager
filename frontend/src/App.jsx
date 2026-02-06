import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Accounts from "./pages/Accounts";
import Trash from "./pages/Trash";



function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED APP */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          <Route path="accounts" element={<Accounts />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="trash" element={<Trash />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
