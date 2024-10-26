const express = require('express');
const BannerModel = require('../models/BannerModel');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/banner');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use absolute path here
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Get all banners
router.get('/', async (req, res) => {
    try {
        const banners = await BannerModel.find();
        res.status(200).json({ data: banners });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Get banner by ID
router.get('/:id', async (req, res) => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) return res.status(404).json({ data: 'Banner not found' });
        res.status(200).json({ data: banner });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Delete banner by ID (with associated image deletion)
router.delete('/:id', async (req, res) => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) return res.status(404).json({ data: 'Banner not found' });

        // Delete associated images from the file system
        banner.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath);
            }
        });

        // Delete the banner from the database
        await BannerModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Banner and associated images deleted' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Create a new banner with image upload
router.post('/create', upload.array('images', 1), async (req, res) => {
    const { title, description } = req.body;
    const images = req.files.map(file => `/uploads/banner/${file.filename}`); // Save relative path

    try {
        if (!title || !description) {
            return res.status(400).json({ data: 'Title and description are required.' });
        }

        const banner = new BannerModel({ title, description, images });
        await banner.save();
        res.status(201).json({ data: banner });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

module.exports = router;
