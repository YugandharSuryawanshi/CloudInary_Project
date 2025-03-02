// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const pool = require('../database/db');
// const cloudinary = require('../config/cloudinary_config');

// const router = express.Router();

// // Multer Storage Configuration
// const storage = multer.memoryStorage(); // Store in memory for Cloudinary
// const upload = multer({ storage });

// // Upload images to MySQL & Cloudinary
// // router.post('/upload', upload.array('images', 10), async (req, res) => {
// //     try {
// //         console.log('Welcome to MySQL & Cloudinary');
// //         console.log(req.body);
// //         console.log(upload.json());
// //         console.log(req.files);
        
        
        
        
// //         if (!req.files || req.files.length === 0) {
// //             return res.status(400).json({ message: 'No files uploaded' });
// //         }

// //         let imagePaths = [];
// //         for (const file of req.files) {
// //             const result = await cloudinary.uploader.upload(file.path);

// //             const [rows] = await pool.query(
// //                 'INSERT INTO images (image_name, image_url, cloudinary_url) VALUES (?, ?, ?)',
// //                 [file.filename, `http://localhost:5000/uploads/${file.filename}`, result.secure_url]
// //             );

// //             imagePaths.push({ id: rows.insertId, imageUrl: result.secure_url });

// //             fs.unlinkSync(file.path); // Delete local file after upload
// //         }

// //         res.status(200).json({ message: 'Images uploaded successfully', data: imagePaths });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Error uploading images', error: error.message });
// //     }
// // });

// router.post('/upload', upload.array('images', 10), async (req, res) => {
//     try {
//         console.log('🔹 Image Upload Route Hit');
//         console.log('📝 Request Body:', req.body);
//         console.log('📂 Uploaded Files:', req.files);

//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: 'No files uploaded' });
//         }

//         let imagePaths = [];

//         for (const file of req.files) {
//             // Upload to Cloudinary
//             const result = await cloudinary.uploader.upload(file.path);
//             console.log('☁️ Cloudinary Upload Success:', result.secure_url);

//             // Save to MySQL Database
//             const [rows] = await pool.query(
//                 'INSERT INTO images (image_name, image_url, cloudinary_url) VALUES (?, ?, ?)',
//                 [file.filename, `http://localhost:5000/uploads/${file.filename}`, result.secure_url]
//             );

//             imagePaths.push({ id: rows.insertId, imageUrl: result.secure_url });

//             // Delete local file after successful upload
//             fs.unlinkSync(file.path);
//         }

//         res.status(200).json({ message: '✅ Images uploaded successfully', data: imagePaths });

//     } catch (error) {
//         console.error('❌ Error Uploading Image:', error);
//         res.status(500).json({ message: 'Error uploading images', error: error.message });
//     }
// });

// // Get all images from MySQL
// router.get('/all-database', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM images');
//         res.status(200).json(rows);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching images', error: error.message });
//     }
// });

// // Get only Cloudinary images
// router.get('/all-cloudinary', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT cloudinary_url FROM images');
//         res.status(200).json(rows);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching cloudinary images', error: error.message });
//     }
// });


const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary_config.js'); // Use correct path
const pool = require('../database/db.js'); // MySQL database
const router = express.Router();

// Use memory storage for buffer uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image Upload Route
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        console.log('🔹 Image Upload Route Hit');
        console.log('📝 Request Body:', req.body);
        console.log('📂 Uploaded Files:', req.files);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        let imagePaths = [];
        for (const file of req.files) {
            // Upload directly from buffer
            const result = await cloudinary.uploader.upload_stream({ resource_type: "image" }, async (error, result) => {
                if (error) {
                    console.error("❌ Cloudinary Upload Error:", error);
                    return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
                }

                // Save Image Info to MySQL
                const [rows] = await pool.query(
                    'INSERT INTO images (image_name, image_url, cloudinary_url) VALUES (?, ?, ?)',
                    [file.originalname, `http://localhost:5000/uploads/${file.originalname}`, result.secure_url]
                );

                imagePaths.push({ id: rows.insertId, imageUrl: result.secure_url });

                // Send response once all images are uploaded
                if (imagePaths.length === req.files.length) {
                    res.status(200).json({ message: 'Images uploaded successfully', data: imagePaths });
                }
            });

            result.end(file.buffer); // Upload buffer to Cloudinary
        }
    } catch (error) {
        console.error('❌ Error Uploading Image:', error);
        res.status(500).json({ message: 'Error uploading images', error: error.message });
    }
});

module.exports = router;



