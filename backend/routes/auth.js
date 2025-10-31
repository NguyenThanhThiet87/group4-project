const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, checkRole } = require('../authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register); 
router.post('/logout', authController.logout);
router.post('/forgot-password', authenticateToken, checkRole('user', 'admin', 'moderator'), authController.forgotPassword);
router.post('/reset-password', authenticateToken, checkRole('user', 'admin', 'moderator'), authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;