import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // điều hướng sau khi đăng nhập

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", formData);

      // Lưu token luôn
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      console.log("Decoded token payload:", token);
      // Nếu backend trả user trong response thì lưu luôn
      try {
          const parts = token.split(".");
          if (parts.length >= 2) {
            // base64url -> base64 + padding
            const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
            const payload = JSON.parse(atob(padded));
            // backend uses `sub` for user id
            const id = payload.sub ?? payload._id ?? payload.userId ?? null;
            console.log("Token id:", id);

            if (id) {
              const userRes = await axios.get(`http://localhost:3000/user/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const user = userRes.data?.user ?? userRes.data;

              if (user && typeof user === "object") {
                localStorage.setItem("user", JSON.stringify(user));
              }
            }
          }
        } catch (err) {
          console.warn("Could not fetch user after login:", err);
        }

      alert("Đăng nhập thành công!");
      navigate("/Profile"); // điều hướng sang trang Profile
    } catch (error) {
      alert("Sai email hoặc mật khẩu!");
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
        <button type="submit">Đăng nhập</button>
      </form>
      <p>
        <Link to="/Register">Đăng ký</Link>
      </p>
    </div>
  );
};

export default Login;

