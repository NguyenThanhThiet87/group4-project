const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./blacklist'); // Import blacklist

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (token == null) {
        return res.sendStatus(401);
    }

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

// Middleware kiểm tra role admin
exports.checkAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Chỉ admin mới có quyền thực hiện hành động này' });
    }
    
    next();
};
