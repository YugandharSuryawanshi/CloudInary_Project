require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();

// Set up multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve local images

// Upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const localFilePath = `/uploads/${req.file.filename}`;
        console.log('File saved locally:', localFilePath);

        console.log('Uploading image to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'photo-gallery' });

        console.log('Image uploaded to Cloudinary:', result.secure_url);

        // Save to MySQL
        const connection = await pool.getConnection();
        try {
            const [dbResult] = await connection.query(
                'INSERT INTO images (image_name, image_url, cloudinary_url) VALUES (?, ?, ?)',
                [req.file.originalname, localFilePath, result.secure_url]
            );
            connection.release();

            console.log('Image stored in database:', dbResult.insertId);

            res.status(201).json({
                success: true,
                image_name: req.file.originalname,
                image_url: localFilePath,
                cloudinary_url: result.secure_url
            });
        } catch (dbError) {
            connection.release();
            console.error('Database error:', dbError);
            res.status(500).json({ error: 'Database operation failed' });
        }
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get database images
app.get('/api/images/db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM images ORDER BY image_name DESC');
        connection.release();

        console.log('Fetched images from database:', rows.length);
        res.json(rows);
        console.log(rows);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch database images' });
    }
});

// Get Cloudinary images
app.get('/api/images/cloud', async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'photo-gallery',
            max_results: 500
        });

        console.log('Fetched images from Cloudinary:', result.resources.length);
        res.json(result.resources);
    } catch (error) {
        console.error('Cloudinary error:', error);
        res.status(500).json({ error: 'Failed to fetch Cloudinary images' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
