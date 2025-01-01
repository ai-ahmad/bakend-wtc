const express = require('express');
const BannerModel = require('../models/BannerModel');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ========================
//   Ensure Upload Dir
// ========================
const uploadDir = path.join(__dirname, '../uploads/banner');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ========================
//   Multer Setup
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store in /uploads/banner
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Append a timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ========================
//       GET All
// ========================
router.get('/', async (req, res) => {
  try {
    const banners = await BannerModel.find();
    // Return an array of banners
    res.status(200).json({ data: banners });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});

// ========================
//       GET by ID
// ========================
router.get('/:id', async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ data: 'Banner not found' });
    }
    res.status(200).json({ data: banner });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});

// ========================
//       CREATE
// ========================
/*
  Expecting an array of images in the field "images".
  Example form-data:
    title: <string>
    description: <string>
    images: <files> (up to n)
*/
router.post('/create', upload.array('images', 5), async (req, res) => {
  const { title, description } = req.body;

  // Build relative file paths for each image
  const images = req.files.map(file => `uploads/banner/${file.filename}`);

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

// ========================
//       DELETE
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ data: 'Banner not found' });
    }

    // Delete associated images from file system
    if (banner.images && banner.images.length > 0) {
      banner.images.forEach((imagePath) => {
        // imagePath is '/uploads/banner/<filename>'
        // We want the absolute path on the server
        const fullImagePath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      });
    }

    // Remove from database
    await BannerModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ data: 'Banner and associated images deleted' });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});

module.exports = router;
