const User = require('../models/User');

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();    // trả về mảng user từ MongoDB
    console.log(users)
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ message: 'name/email required' });
    }
    const created = await User.create({ name, email });
    res.status(201).json(created);             // { _id, name, email, ... }
  } catch (err) {
    // nếu sau này đặt unique cho email
    if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};