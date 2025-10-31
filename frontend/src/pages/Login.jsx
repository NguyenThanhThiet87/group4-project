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
      console.log("Login response:", res.data);
      // Lưu token luôn
      const token = res.data;
      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      
      console.log("Decoded token payload:", token);
      // Nếu backend trả user trong response thì lưu luôn
      try {
          const parts = token.accessToken.split(".");
          if (parts.length >= 2) {
            // base64url -> base64 + padding
            const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
            const payload = JSON.parse(atob(padded));
            // backend uses `sub` for user id
            const id = payload.sub ?? null;
            // Lấy vai trò (role) nếu có trong payload
            const role = payload.role ?? null;
            console.log("Token id:", id, "role:", role);
            localStorage.setItem("user", JSON.stringify({ id, role }));
            
            alert("Đăng nhập thành công!");

            if(role === "admin")
            {
              navigate("/UserList"); // điều hướng sang trang Profile
            }else if(role === "user"){
              navigate("/Profile"); // điều hướng sang trang Profile
            }
          }
        } catch (err) {
          console.warn("Could not fetch user after login:", err);
        }
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
        <Link to="/ForgotPassword">Quên mật khẩu?</Link>
      </p>
      <p>
        <Link to="/Register">Đăng ký</Link>
      </p>
    </div>
  );
};

export default Login;

