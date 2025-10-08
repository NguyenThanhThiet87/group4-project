import React, { useState } from "react";
import axios from "axios";

function AddUser() {
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://192.168.110.210:3000/users", newUser)
      .then(() => {
        alert("Thêm user thành công!");
        setNewUser({ name: "", email: "" });
      })
      .catch(err => console.error("Lỗi khi thêm user:", err));
  };

  return (
    <div>
      <h3>Thêm người dùng</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tên"
          value={newUser.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
