# Group4 Project

Ứng dụng quản lý người dùng gồm:

- **Backend:** Node.js + Express + Mongoose
- **Frontend:** React + Redux Toolkit + Axios
- **Database:** MongoDB Atlas

## 1. Chuẩn bị
- Cài Node.js LTS và Git.
- Tạo cluster MongoDB Atlas, lấy connection string.
- Tạo tài khoản Cloudinary, Gmail App Password.

## 2. Chạy backend

```bash
cd backend
npm install
```

Tạo file `.env`:

```
MONGO_URI=<chuỗi-kết-nối-MongoDB>
PORT=3000
JWT_SECRET=<chuỗi-bất-kỳ>

EMAIL_USER=<gmail-dùng-gửi-mail>
EMAIL_PASS=<app-password-16-ký-tự>

CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

Khởi động:

```bash
npm start
```

> Server sẽ lắng nghe `http://localhost:3000`.

## 3. Chạy frontend

```bash
cd frontend
npm install
```

Tạo file `.env`:

```
REACT_APP_API_URL=http://localhost:3000
PORT=3001
```

Khởi động:

```bash
npm start
```

> Ứng dụng mở tại `http://localhost:3001`.

## 4. Tính năng chính
- Đăng ký / đăng nhập với JWT & refresh token.
- Bảo vệ route `/profile`, `/admin`.
- Quên mật khẩu qua email (Nodemailer).
- Upload ảnh (Cloudinary, nếu cấu hình).
- Ghi log thao tác và rate limiting đăng nhập.

## 5. Deploy
- **Backend:** Render / Railway → chọn thư mục `backend`, đặt biến môi trường giống `.env`.
- **Frontend:** Vercel → chọn thư mục `frontend`, thêm biến `REACT_APP_API_URL` trỏ tới URL backend (đã deploy).
- **Database:** sử dụng MongoDB Atlas (MONGO_URI chung cho các môi trường).
