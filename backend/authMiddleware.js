const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./blacklist'); // Import blacklist
const Logs = require('./models/Logs'); // ← THÊM
const rateLimit = require('express-rate-limit'); // ← THÊM

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

// ========== LOG ACTIVITY ========== ← THÊM
exports.logActivity = (action) => {
    return async (req, res, next) => {
        const userId = req.user?.id || req.body?.email || 'anonymous';
        const ip = req.ip || req.connection.remoteAddress;
        
        try {
            await Logs.create({
                createdAt: new Date().toISOString(),
                userId,
                action,
                ip
            });
            console.log(`✅ [${action}] ${userId} from ${ip}`);
        } catch (error) {
            console.error('❌ Log error:', error);
        }
        
        next();
    };
};

// ========== RATE LIMIT LOGIN ========== ← THÊM
exports.rateLimitLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Tối đa 5 lần
    message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
    standardHeaders: true,
    legacyHeaders: false,
    
    // ← QUAN TRỌNG: Tạo key theo EMAIL, không phải IP
    keyGenerator: (req) => {
        // Lấy email từ body
        return req.body.email || req.ip;
    },
    
    // ← CHỈ ĐẾM REQUEST THẤT BẠI
    skipSuccessfulRequests: true,
    
    // ← Custom handler để trả về thông tin chi tiết
    handler: (req, res) => {
        res.status(429).json({
            message: `Tài khoản ${req.body.email} đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.`,
            email: req.body.email,
            retryAfter: 15 * 60 // seconds
        });
    }
});