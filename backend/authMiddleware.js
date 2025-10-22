const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./blacklist'); // Import blacklist

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    // --- BƯỚC KIỂM TRA QUAN TRỌNG NHẤT ---
    // Kiểm tra xem token có nằm trong blacklist không.
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token đã bị vô hiệu hóa' });
    }

    // Nếu không, tiếp tục xác thực như bình thường
    jwt.verify(token, 'dev_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }
        req.user = user;
        next();
    });
};