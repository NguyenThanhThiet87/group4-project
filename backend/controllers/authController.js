const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const tokenBlacklist = require('../blacklist');

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
                        id: user._id.toString(),
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