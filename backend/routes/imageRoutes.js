const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { uploadImage, getDbImages, deleteImage } = require('../controllers/imageController');

router.post('/upload', upload.single('image'), uploadImage);
router.get('/images/db', getDbImages);
router.delete('/images/delete', deleteImage);

module.exports = router;
