// import React from "react";
// import UserList from "./UserList";
// import AddUser from "./AddUser";

// function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Quản lý người dùng</h2>
//       <AddUser />
//       <hr />
//       <UserList />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Trang chủ</h1>} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
