const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: {type: String, required: true, trim: true},
  role: {type: String, required: true, trim: true}
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

//code backend
const str ="backend"