import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // get email from location.state or query string
  const getEmailFromLocation = () => {
    if (location?.state?.email) return location.state.email;
    const params = new URLSearchParams(location.search || "");
    return params.get("email") || "";
  };

  const [email] = useState(getEmailFromLocation());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // optional: prefill email input if you want it visible later
  }, []);

  const validate = () => {
    if (!email) {
      alert("Không có email. Quay lại trang quên mật khẩu và nhập email.");
      return false;
    }
    if (!password || password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Try common reset endpoint. Adjust if backend uses different path.
      await axios.post("http://localhost:3000/auth/reset-password", {
        email,
        password,
      });

      alert("Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.");
      navigate("/Login");
    } catch (err) {
      console.error("Reset password error:", err);
      // show backend message if any
      const msg = err?.response?.data?.message ?? "Không thể reset mật khẩu. Kiểm tra console.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="forgot-title">ĐẶT LẠI MẬT KHẨU</h2>
        <form onSubmit={handleSubmit} className="forgot-form">
          <label>Email</label>
          <input type="email" value={email} readOnly className="readonly-input" />

          <label> Mật khẩu mới </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label> Xác nhận mật khẩu mới </label>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Reset"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;