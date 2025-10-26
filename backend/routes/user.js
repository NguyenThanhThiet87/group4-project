const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const {upload} = require('../cloudinary'); 

router.get('/users',userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser); // PUT
router.delete('/users/:id', userController.deleteUser); // DELETE
router.post( '/users/upload-avatar', upload.single('avatar'), userController.uploadAvatar);

module.exports = router;