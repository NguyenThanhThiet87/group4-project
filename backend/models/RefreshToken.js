const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  userId:  { type: String, required: true, trim: true },
  refreshToken: { type: String, required: true, trim: true },
  expiresAt: {type: String, required: true, trim: true}
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

//code backend
const str ="backend"