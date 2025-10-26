const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: {type: String, required: true, trim: true},
  role: {type: String, required: true, trim: true},
  image: { type: String, required: false, trim: true },
  resetPasswordToken: { type: String, required: false, trim: true },
  resetPasswordExpires: { type: Date, required: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

//code backend
const str ="backend"