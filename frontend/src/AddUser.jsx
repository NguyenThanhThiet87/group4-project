import React, { useState } from "react";
import api from '../axiosConfig';

function AddUser({ fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🧩 Hàm xử lý submit có kiểm tra validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tên trống
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }

    // Kiểm tra định dạng email
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      // Gửi dữ liệu lên backend
      await api.post("/users", { name, email });

      alert("Thêm user thành công!");

      // Reset form
      setName("");
      setEmail("");

      // Gọi lại hàm fetchUsers() để cập nhật danh sách
      if (fetchUsers) fetchUsers();

    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Không thể thêm user, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <h3>Thêm người dùng</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
