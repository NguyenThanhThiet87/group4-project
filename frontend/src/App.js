import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./features/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserList from "./UserList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route
        path="/Profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/UserList"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;