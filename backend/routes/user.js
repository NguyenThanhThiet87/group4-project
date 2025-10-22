const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, checkAdmin } = require('../authMiddleware');

router.get('/users',userController.getUsers);
router.get('/users/:id', userController.getUsersById);
router.post('/users', userController.createUser);
router.put('/users/:id', authenticateToken, userController.updateUser); // PUT
router.delete('/users/:id', authenticateToken, checkAdmin, userController.deleteUser); // DELETE - chỉ admin

module.exports = router;