import React, { useEffect, useState } from "react";
import axios from "axios";
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://192.168.110.146:3000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Lỗi khi lấy user:", err));
  }, []);

  return (
    <div>
      <h3>Danh sách người dùng</h3>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((u, i) => (
            <li key={i}>{u.name} - {u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
