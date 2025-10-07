const express = require('express');
const app = express();
app.use(express.json());

// để máy khác gọi api đến server trên cùng mạng trong nội bộ.
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/user');
app.use('/', userRoutes);
