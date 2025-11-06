const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, checkRole } = require('../authMiddleware');
const { rateLimitLogin, logActivity } = require('../authMiddleware');

router.get('/logs', authenticateToken, checkRole('admin', 'moderator'), authController.getLogs);
router.post('/login', rateLimitLogin, logActivity('LOGIN'), authController.login);
router.post('/register', logActivity('REGISTER'), authController.register); 
router.post('/logout', logActivity('LOGOUT'), authController.logout);
router.post('/forgot-password', logActivity('FORGOT_PASSWORD'), authController.forgotPassword);
router.post('/reset-password',  logActivity('RESET_PASSWORD'), authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;