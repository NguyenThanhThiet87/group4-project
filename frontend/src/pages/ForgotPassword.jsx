import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = (email || "").trim();
    if (!trimmed) {
      alert("Vui lòng nhập email.");
      return;
    }
    // basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(trimmed)) {
      alert("Email không hợp lệ.");
      return;
    }

    try {
        axios.post("http://localhost:3000/auth/forgot-password", {"email": trimmed});
        alert("Yeu cau da duoc gui qua email cua ban. Vui long kiem tra gmail")
      } catch (error) {
        console.error("❌ Error send email user info:", error);
        alert("Lỗi khi gui yeu cau. Vui lòng thử lại.");
        return;
      }

    // // navigate to ResetPassword, pass email in state and querystring for compatibility
    // navigate(`/ResetPassword?email=${encodeURIComponent(trimmed)}`, { state: { email: trimmed } });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="forgot-title">QUÊN MẬT KHẨU</h2>
        <form onSubmit={handleSubmit} className="forgot-form">
          <label htmlFor="email">Nhập email của bạn:</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="forgot-btn">Xác nhận reset mật khẩu</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;