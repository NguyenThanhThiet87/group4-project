const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadWithSharp } = require('../cloudinary');

const { authenticateToken, checkRole } = require('../authMiddleware');

router.get('/users', authenticateToken, checkRole('admin', 'moderator'), userController.getUsers);
router.get('/users/:id', authenticateToken, checkRole('user', 'admin', 'moderator'), userController.getUsersById);
router.post('/users', authenticateToken, checkRole('admin', 'moderator'), userController.createUser);

router.put('/users/:id', authenticateToken, checkRole('user', 'admin', 'moderator'), userController.updateUser); // PUT
router.delete('/users/:id', authenticateToken, checkRole('admin', 'moderator'), userController.deleteUser); // DELETE - chỉ admin
router.post( '/users/avatar', authenticateToken, checkRole('user', 'admin', 'moderator'), uploadWithSharp, userController.uploadAvatar);

module.exports = router;
