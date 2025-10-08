1) Mô tả dự án
Bài thực hành CRUD người dùng (User) gồm:
    * Backend: Node.js + Express + Mongoose, kết nối MongoDB Atlas
    * Frontend: React + Axios, gọi API backend
    * Chức năng: GET/POST/PUT/DELETE user (name, email)

2) Công nghệ sử dụng
    * Backend: Node.js (LTS), Express, Mongoose, Nodemon, CORS, Dotenv
    * Frontend: React (CRA), Axios
    * Database: MongoDB Atlas (cluster M0)

3) Hướng dẫn chạy (local)
Yêu cầu: Node LTS, Git.
# 1) Clone
git clone https://github.com/NguyenThanhThiet87/group4-project
cd group4-project

3.1 Backend
cd backend
npm install
# Tạo file .env
# MONGO_URI lấy tại Atlas -> Connect -> Drivers (Node.js)
# Ví dụ:
# MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/groupDB?retryWrites=true&w=majority
echo MONGO_URI=<dán-chuỗi-kết-nối> > .env
echo PORT=3000 >> .env

npm run dev
# Kỳ vọng: "MongoDB connected" + "Server running on port 3000"

3.2 Frontend
cd ../frontend
npm install
# file .env (frontend)
# Nếu backend chạy cùng máy: http://localhost:3000
# Nếu backend chạy máy khác trong LAN: http://<IP-may-backend>:3000
echo REACT_APP_API_URL=http://localhost:3000 > .env
echo PORT=3001 >> .env

npm start
# Mở http://localhost:3001


Chạy qua LAN: đảm bảo backend lắng nghe 0.0.0.0 và mở cổng 3000:
app.listen(PORT, '0.0.0.0', ...)

Windows: netsh advfirewall firewall add rule name="NodeJS 3000" dir=in action=allow protocol=TCP localport=3000

4) Đóng góp từng thành viên
Nguyễn Thanh Thiệt: Thực hiện phần backend
Dương Lý Cử: Thực hiện phần frontend
Kim Hoàng Trân: Thực hiện phần database
