const mongoose = require('mongoose');           // <-- THÊM DÒNG NÀY
const User = require('../models/User');
const { cloudinary } = require('../cloudinary');

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//
exports.getUsersById = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find({ _id: id }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'name/email required' });
    const created = await User.create({ name, email });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (user != null) {
    const { name, email, password } = req.body;
    if (email != user.email) {
      const isExistUser = await User.findOne({ email: email })
      if (isExistUser != null) {
        return res.status(409).json({ message: 'Email already exists' });
      } else {
        user.name = name;
        user.email = email;
        user.password = password;
        await user.save();
        return res.status(200).json(user);
      }
    } else {
      user.name = name;
      user.password = password;
      await user.save();
      return res.status(200).json(user);
    }
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid id' });

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    // 1. Kiểm tra có file không
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    // 2. Lấy userId
    const userId = req.body.id;

    if (!userId) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin user' });
    }

    // 3. Tìm user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }
    // 4. Xóa avatar cũ (nếu có)
    if (user.image) { // ← SỬA: user.avatar (không phải user.image)
      try {
        const urlParts = user.avatar.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `avatars/${publicIdWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
        console.log('✅ Deleted old avatar:', publicId);
      } catch (error) {
        console.error('⚠️ Error deleting old avatar:', error);
      }
    }

    // 5. Lấy URL ảnh (đã upload bởi middleware)
    const avatarUrl = req.file.path;

    // 6. Cập nhật database
    user.image = avatarUrl;
    await user.save();
    console.log('✅ Avatar uploaded:', avatarUrl);

    res.status(200).json({
      message: 'Upload avatar thành công'
    });

  } catch (error) {
    console.error('❌ Upload avatar error:', error);
  }
};