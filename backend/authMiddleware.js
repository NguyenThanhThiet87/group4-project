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

// Middleware kiểm tra role
exports.checkRole = (...allowedRoles) => {
  // chuẩn hoá mảng role cho chắc
  const allow = new Set(allowedRoles.map(r => String(r).toLowerCase()));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const role = String(req.user.role || '').toLowerCase();
    if (!allow.has(role)) {
      return res.status(403).json({ message: 'Không đủ quyền' });
    }
    next();
  };
};
