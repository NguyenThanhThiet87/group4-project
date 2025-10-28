import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const refreshToken = async (navigate) => {
    console.log("Refreshing token...");
  try {
    // Lấy refresh token đã lưu
    const savedRefreshToken = localStorage.getItem("refreshToken");
    
    if (!savedRefreshToken)
    {
      navigate("/");
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      return;
    }

    const res = await axios.post(
      "http://localhost:3000/auth/refresh-token",
      { refreshToken: savedRefreshToken } // gửi dưới dạng object
    );

    // res.data = { accessToken, refreshToken? }
    const { accessToken} = res.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken); // cập nhật access token
      console.log("New access token:", accessToken);
    }

  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Nếu refresh thất bại → logout
    localStorage.removeItem("token");
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
  }
};


const UserProfile = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // điều hướng sau khi đăng nhập

  // Get user on page load
  useEffect(() => {
       // Gọi ngay khi mount
    refreshToken(navigate);
         // Set interval với callback
    const interval = setInterval(() => {
      refreshToken(navigate);
    }, 10000);

    let storedUser = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) storedUser = JSON.parse(raw);
    } catch (err) {
      console.warn("Invalid stored user JSON, ignoring", err);
      storedUser = null;
    }

    const id = storedUser?.[0]?._id;
    if (id) fetchUser(id);
    else alert("Không tìm thấy thông tin người dùng. Hãy đăng nhập lại!");

        // Cleanup khi unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch user by ID from API
  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/user/users/${id}`);
      const payload = res.data?.user ?? res.data?.data ?? res.data;
      const normalized = Array.isArray(payload) ? payload[0] : payload;
      setUser(normalized || { name: "", email: "", avatar: "" });
    } catch (error) {
      console.error("❌ Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle new file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Show image preview
      const preview = URL.createObjectURL(file);
      setUser({ ...user, image: preview });
    }
  };


  // Handle profile update
  const handleUpdate = async () => {
    if (!user || !user._id) {
      alert("User ID not found for update.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload avatar if a new one is selected
      if (selectedFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("id", user._id);
        avatarFormData.append("avatar", selectedFile);

        try {
          await axios.post(
            "http://localhost:3000/user/users/upload-avatar",
            avatarFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } catch (uploadError) {
          console.error("❌ Error uploading avatar:", uploadError);
          alert("Lỗi khi tải lên ảnh đại diện. Vui lòng thử lại.");
          setUploading(false);
          return;
        }
      }

      // Step 2: Update user's name and email
      try {
        await axios.put(
          `http://localhost:3000/user/users/${user._id}`,
          { name: user.name, email: user.email },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } catch (updateError) {
        console.error("❌ Error updating user info:", updateError);
        alert("Lỗi khi cập nhật thông tin. Vui lòng thử lại.");
        setUploading(false);
        return;
      }

      setSelectedFile(null);
      setIsEditing(false);
      alert("✅ Cập nhật thành công!");
      fetchUser(user._id);
    } catch (error) {
      console.error("❌ An unexpected error occurred during update:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="profile-container">
        <h2>Thông tin người dùng</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  const getAvatarSrc = () => {
    if (user.image) {
      if (user.image.startsWith("blob:")) {
        return user.image;
      }
      return user.image;
    }
    return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  };

  return (
    <div className="profile-container">
      <h2>Thông tin người dùng</h2>
      <div className="profile-form">
        <div className="avatar-section">
          <img src={getAvatarSrc()} alt="Avatar" className="avatar-img" />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="avatar-input"
            />
          )}
        </div>

        <label>Họ tên:</label>
        <input
          type="text"
          name="name"
          value={user?.name ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user?.email ?? ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Sửa thông tin</button>
        ) : (
          <button onClick={handleUpdate} disabled={uploading}>
            {uploading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;


