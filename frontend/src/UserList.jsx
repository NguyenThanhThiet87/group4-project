import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css"; // bạn có thể tạo file CSS riêng nếu muốn
import { useNavigate } from "react-router-dom";
import api from './axiosConfig';
import LogsPanel from "./LogsPanel";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách người dùng khi load trang
  useEffect(() => {
    fetchUsers();
 }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // thử hai endpoint phổ biến; nếu server dùng base path khác thì sửa ở đây
        // fallback nếu route khác trên backend (ví dụ /user/users)
      let res = await api.get("/user/users");

      // normalize response: có thể server trả mảng trực tiếp hoặc { users: [...] } hoặc { data: [...] }
      const data = res.data?.users ?? res.data?.data ?? res.data;
      if (!Array.isArray(data)) {
        console.warn("Unexpected users response shape:", res.data);
        throw new Error("Unexpected users response shape");
      }
      setUsers(data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách user:", err);
      // hiển thị lỗi cụ thể trong UI thay vì chỉ alert
      alert("Không thể tải danh sách người dùng! Xem console (Network) để biết chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 Xóa user
  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm("Bạn có chắc muốn xóa người dùng này không?");
    if (!ok) return;

    console.log(id)
    try {
      setDeletingId(id);
     
      // thử fallback route
      await api.delete(`/user/users/${id}`);

      // Nếu thành công xóa trên UI
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("Đã xóa người dùng thành công.");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          alert("Không có quyền xóa người dùng. Chỉ admin được phép.");
        } else {
          alert(`Xóa thất bại: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        alert("Xóa thất bại: Kiểm tra kết nối tới server.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // 🔵 Khi nhập liệu trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await api.post("/auth/logout",
{ refreshToken });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  

  if (loading) return <p>Đang tải danh sách người dùng...</p>;

  return (
    <div className="admin-container">
      <h2>👤 Quản lý người dùng</h2>
      <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>

      {/* Danh sách user */}
      <table className="user-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">Chưa có người dùng nào.</td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(u._id)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

       <LogsPanel />
    </div>
  );
}

export default UserList;
