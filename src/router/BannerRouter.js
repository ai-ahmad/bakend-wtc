const express = require('express');
const BannerModel = require('../models/BannerModel');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ========================
//   Ensure Upload Dir
// ========================
const uploadDir = path.join(__dirname, './uploads/banner');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ========================
//   Multer Setup
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ========================
//       GET All
// ========================
/**
 * @swagger
 * /api/banners:
 *   get:
 *     description: Get all banners
 *     tags:
 *       - Banner
 *     responses:
 *       200:
 *         description: A list of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const banners = await BannerModel.find();
    res.status(200).json({ data: banners });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});

// ========================
//       GET by ID
// ========================
/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     description: Get banner by ID
 *     tags:
 *       - Banner
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Banner ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/banners/create:
 *   post:
 *     description: Create a new banner
 *     tags:
 *       - Banner
 *     parameters:
 *       - name: title
 *         in: body
 *         description: Title of the banner
 *         required: true
 *         schema:
 *           type: string
 *       - name: description
 *         in: body
 *         description: Description of the banner
 *         required: true
 *         schema:
 *           type: string
 *       - name: images
 *         in: formData
 *         description: Images of the banner
 *         required: true
 *         type: array
 *         items:
 *           type: file
 *           format: binary
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/create', upload.array('images', 5), async (req, res) => {
  const { title, description } = req.body;
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
/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     description: Delete a banner by ID
 *     tags:
 *       - Banner
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Banner ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Banner and associated images deleted successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ data: 'Banner not found' });
    }

    if (banner.images && banner.images.length > 0) {
      banner.images.forEach((imagePath) => {
        const fullImagePath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      });
    }

    await BannerModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ data: 'Banner and associated images deleted' });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});


// ========================
//       UPDATE
// ========================
/**
 * @swagger
 * /api/banners/{id}/update:
 *   put:
 *     description: Update an existing banner
 *     tags:
 *       - Banner
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Banner ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *       - name: title
 *         in: body
 *         description: New title of the banner
 *         required: false
 *         schema:
 *           type: string
 *       - name: description
 *         in: body
 *         description: New description of the banner
 *         required: false
 *         schema:
 *           type: string
 *       - name: images
 *         in: formData
 *         description: New images for the banner
 *         required: false
 *         type: array
 *         items:
 *           type: file
 *           format: binary
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.put('/:id/update', upload.array('images', 5), async (req, res) => {
  const { title, description } = req.body;
  const images = req.files ? req.files.map(file => `uploads/banner/${file.filename}`) : [];

  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ data: 'Banner not found' });
    }

    if (title) banner.title = title;
    if (description) banner.description = description;

    // If there are new images, replace the old ones
    if (images.length > 0) {
      // Remove old images from the filesystem
      banner.images.forEach((imagePath) => {
        const fullImagePath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      });
      banner.images = images;  // Update images
    }

    await banner.save();
    res.status(200).json({ data: banner });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
});


module.exports = router;
