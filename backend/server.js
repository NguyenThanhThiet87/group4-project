const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;

// Kết nối MongoDB rồi mới mở server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connect error:', err.message);
    process.exit(1);
  }
})();