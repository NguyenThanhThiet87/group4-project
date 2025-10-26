import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserList from "./UserList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Profile" element={<UserProfile />} />
      <Route path="/ForgotPassword" element={<ForgotPassword/>} />
      <Route path="/ResetPassword" element={<ResetPassword/>} />
      <Route path="/UserList" element={<UserList />} />
    </Routes>
  );
}

export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Trang đăng nhập */}
//         <Route path="/" element={<Login />} />

//         {/* Trang đăng ký */}
//         <Route path="/register" element={<Register />}>
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
