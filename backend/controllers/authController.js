const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');

const tokenBlacklist = require('../blacklist');

// ← THÊM: Cấu hình Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Dùng Gmail
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS  // App Password (16 ký tự)
    }
});

exports.login = async (req, res) => {
    const { email, password } = req.body || {}
    if (email != null && password != null) {
        const regex = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+")
        const user = await User.findOne({ email: email })
        if (user != null) {
            if (bcrypt.compare(password, user.password)) //dùng bcrypt
            {
                // ký token với đầy đủ thông tin user
                const token = jwt.sign(
                    { 
                        sub: user._id.toString(),
                        email: user.email,
                        role: user.role  // ← QUAN TRỌNG: thêm role vào token
                    },
                    'dev_secret', // thay bằng biến môi trường trong production
                    { expiresIn: '1h' }
                );
                res.json({accessToken: token})
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "Not found" });
        }
    }
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body || {}
    if (email != null && password != null) {
        const regex = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+")
        const user = await User.findOne({ email: email })
        if (user == null) {
            pass = await bcrypt.hash(password, 10)
            const created = await User.create({ name: name, email: email, password: pass, role: 'user'})
            res.status(201).json(created);
        } else {
            res.status(404).json({ message: "Already exist" });
        }
    }
}

exports.logout = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ message: 'Không tìm thấy token' });
    }

    // Thêm token vào blacklist
    tokenBlacklist.add(token);

    res.status(200).json({ message: 'Đăng xuất thành công' });
};

exports.forgotPassword = async (req, res) => {
    const {email } = req.body || {};
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }else
    {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token hết hạn sau 15 phút

        await user.save();
        
        // 6. Tạo link reset password
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        // 7. Cấu hình nội dung email
        const mailOptions = {
            from: {
                name: 'TNT Project4',
                address: process.env.EMAIL_USER
            },
            to: email, // Email người nhận
            subject: '🔐 Reset Password Request', // Tiêu đề email
            text: `Bạn đã yêu cầu đặt lại mật khẩu. Truy cập link: ${resetUrl}`, // Nội dung text thuần
        };

        // 8. GỬI EMAIL qua Nodemailer
        await transporter.sendMail(mailOptions);

        // 9. Trả về response
        res.status(200).json({ 
            message: 'Email reset password đã được gửi. Vui lòng kiểm tra hộp thư của bạn.' 
        });
    }
}

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token và mật khẩu mới là bắt buộc' });
    }else
    {
        // 3. Hash token từ request để so sánh với DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 4. Tìm user có token hợp lệ và chưa hết hạn
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // Token chưa hết hạn
        });

         if (!user) {
            return res.status(400).json({ 
                message: 'Token không hợp lệ hoặc đã hết hạn' 
            });
        }

        // 5. Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 6. Cập nhật mật khẩu và xóa reset token
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
    }
}