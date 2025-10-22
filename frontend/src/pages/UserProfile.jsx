import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟢 Gọi API lấy thông tin user khi load trang
useEffect(() => {
    let storedUser = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) storedUser = JSON.parse(raw);
      console.log("Stored user from localStorage:", storedUser);
    } catch (err) {
      console.warn("Invalid stored user JSON, ignoring", err);
      storedUser = null;
    }

    const id = storedUser[0]._id
    if (id != null) {
      fetchUser(id);
    } else {
      alert("Không tìm thấy thông tin người dùng. Hãy đăng nhập lại!");
    }
  }, []);

  // 🟢 Hàm gọi API lấy user theo ID
  const fetchUser = async (id) => {
    setLoading(true);
    try {
      // Try the most common endpoint first (/users/:id), fallback to /user/users/:id
      let res = await axios.get(`http://localhost:3000/user/users/${id}`);
    
      // Normalize response: many APIs nest the user under `user` or `data`
      const payload = res.data?.user ?? res.data?.data ?? res.data;

      // If the payload is an array, pick the first item
      const normalized = Array.isArray(payload) ? payload[0] : payload;

      // Ensure we have an object with name/email to avoid uncontrolled input warnings
      setUser(normalized || { name: "", email: "" });
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin user:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Xử lý thay đổi trong input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🟢 Xử lý cập nhật user
  const handleUpdate = async () => {
    if (!user || !user._id) {
      alert("Không có id user để cập nhật.");
      return;
    }

    try {
        let res = await axios.put(`http://localhost:3000/user/users/${user._id}`, user);

      const payload = res.data?.user ?? res.data?.data ?? res.data;
      setUser(Array.isArray(payload) ? payload[0] : payload);
      setIsEditing(false);
      alert("✅ Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Thông tin người dùng</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Thông tin người dùng</h2>
      <div className="profile-form">
        <label>Họ tên:</label>
        <input
          type="text"
          name="name"
          value={user?.name ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user?.email ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Sửa thông tin</button>
        ) : (
          <button onClick={handleUpdate}>Cập nhật</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

