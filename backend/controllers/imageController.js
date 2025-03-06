const pool = require('../config/dbConfig');
const cloudinary = require('../config/cloudInary_config');
const path = require('path');
const fs = require('fs');

// Upload Image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const localFilePath = `/uploads/${req.file.filename}`;
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'photo-gallery' });

        const connection = await pool.getConnection();
        try {
            const [dbResult] = await connection.query(
                'INSERT INTO images (image_name, image_url, cloudinary_url) VALUES (?, ?, ?)',
                [req.file.originalname, localFilePath, result.secure_url]
            );
            connection.release();

            res.status(201).json({
                success: true,
                image_id: dbResult.insertId,
                image_name: req.file.originalname,
                image_url: localFilePath,
                cloudinary_url: result.secure_url
            });
        } catch (dbError) {
            connection.release();
            console.error('Database error:', dbError);
            res.status(500).json({ success: false, message: 'Database operation failed' });
        }
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch images from database
const getDbImages = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM images ORDER BY id DESC');
        connection.release();

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images' });
    }
};

// Delete Image from DB & Cloudinary
const deleteImage = async (req, res) => {
    try {
        const imageId = req.query.image_id;
        if (!imageId) {
            return res.status(400).json({ success: false, message: 'Image ID is required' });
        }

        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT cloudinary_url FROM images WHERE id = ?', [imageId]);

        if (rows.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        const cloudinaryUrl = rows[0].cloudinary_url;
        const publicId = cloudinaryUrl.split('/').pop().split('.')[0];

        await cloudinary.uploader.destroy(publicId);
        await connection.query('DELETE FROM images WHERE id = ?', [imageId]);
        connection.release();

        res.json({ success: true, message: 'Image deleted from Cloudinary and Database' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { uploadImage, getDbImages, deleteImage };
