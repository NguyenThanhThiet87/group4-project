import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { loginUser, clearError } from "../slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      const token = result.payload;
      try {
        const parts = token.accessToken.split(".");
        if (parts.length >= 2) {
          const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
          const payload = JSON.parse(atob(padded));
          const id = payload.sub ?? null;
          const role = payload.role ?? null;
          localStorage.setItem("user", JSON.stringify({ id, role }));
          alert("Đăng nhập thành công!");
          if (role === "admin") {
            navigate("/UserList");
          } else if (role === "user") {
            navigate("/Profile");
          }
        }
      } catch (err) {
        console.warn("Could not decode token:", err);
      }
    } else if (loginUser.rejected.match(result)) {
      if (result.payload) {
        alert(`❌ ${result.payload}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
      <p>
        <Link to="/ForgotPassword">Quên mật khẩu?</Link>
      </p>
      <p>
        <Link to="/Register">Đăng ký</Link>
      </p>
    </div>
  );
};

export default Login;