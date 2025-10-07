import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý người dùng</h2>
      <AddUser />
      <hr />
      <UserList />
    </div>
  );
}

export default App;
