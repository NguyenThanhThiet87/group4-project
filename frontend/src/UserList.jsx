import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // lưu user đang được sửa
  const [formData, setFormData] = useState({ name: "", email: "" }); // dữ liệu trong form

  // 1️⃣ Lấy danh sách user
  useEffect(() => {
    axios
      .get("http://localhost:3000/user/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Lỗi khi lấy user:", err));
  }, []);

  // 2️⃣ Hàm xóa user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/user/users/${id}`);
      console.log("Xid: ",users.filter(user => user._id !== id));
      // Cập nhật lại danh sách user sau khi xóa
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  // 3️⃣ Hàm bắt đầu sửa user → hiện form
  const handleEdit = (user) => {
    setEditingUser(user); // đánh dấu user đang được sửa
    setFormData({ name: user.name, email: user.email }); // hiển thị dữ liệu vào form
  };

  // 4️⃣ Khi gõ trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5️⃣ Gửi PUT request để cập nhật user
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://192.168.110.210:3000/users/${editingUser._id}`,
        formData
      );

      // Cập nhật lại danh sách user sau khi sửa thành công
      setUsers(users.map(u => (u._id === editingUser._id ? res.data : u)));
      setEditingUser(null); // ẩn form sau khi sửa xong
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
    }
  };

  return (
    <div>
      <h3>Danh sách người dùng</h3>

      {/* 6️⃣ Nếu đang sửa thì hiện form */}
      {editingUser && (
        <div style={{ marginBottom: "20px", background: "#f8f8f8", padding: "10px" }}>
          <h4>Sửa người dùng</h4>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tên"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <button onClick={handleUpdate}>Lưu</button>
          <button onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
      )}

      {/* 7️⃣ Danh sách người dùng */}
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((u, i) => (
            <li key={i}>
              {u.name} - {u.email}{" "}
              <button onClick={() => handleEdit(u)}>Sửa</button>
              <button onClick={() => handleDelete(u._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
