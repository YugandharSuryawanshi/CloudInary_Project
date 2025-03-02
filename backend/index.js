const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const imageRoutes = require('./routes/image_route');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/images', imageRoutes);

// Server Start
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
