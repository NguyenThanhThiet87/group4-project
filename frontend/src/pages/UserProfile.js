import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Lấy thông tin user từ localStorage (hoặc API)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Xử lý khi người dùng thay đổi input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Xử lý khi bấm "Cập nhật"
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/users/${user.id}`, user);
      alert("Cập nhật thành công!");
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditing(false);
    } catch (error) {
      alert("Cập nhật thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Thông tin người dùng</h2>
      <div className="profile-form">
        <label>Họ tên:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
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
