const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
  createdAt:  { type: String, required: true, trim: true },
  userId: { type: String, required: true, trim: true },
  action: {type: String, required: true, trim: true},
  ip: {type: String, required: true, trim: true},
  success: { type: String, required: false, trim: true },
  route: { type: String, required: false, trim: true },
  message: { type: String, required: false, trim: true },
  meta: { type: String, required: false, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Logs', LogsSchema);

//code backend
const str ="backend"