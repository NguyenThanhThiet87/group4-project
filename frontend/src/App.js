import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Profile" element={<UserProfile />} />
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
