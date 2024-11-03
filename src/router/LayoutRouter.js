const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Layout = require('../models/LayoutModels');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/layouts');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new layout
router.post('/create', upload.single('bg_image'), async (req, res) => {
    try {
        const {
            title,
            descriptions,
            "1_text": text1,
            "2_text": text2,
            "3_text": text3,
            "4_text": text4
        } = req.body;
        const bg_images = `/uploads/layout/${req.file.filename}`;

        const newLayout = new Layout({
            title,
            descriptions,
            "1_text": JSON.parse(text1),
            "2_text": JSON.parse(text2),
            "3_text": JSON.parse(text3),
            "4_text": JSON.parse(text4),
            bg_images
        });

        await newLayout.save();
        res.status(201).json({ message: 'Layout created successfully', layout: newLayout });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create layout', details: error.message });
    }
});

// Get all layouts
router.get('/', async (req, res) => {
    try {
        const layouts = await Layout.find();
        res.status(200).json(layouts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch layouts', details: error.message });
    }
});

// Get a layout by ID
router.get('/:id', async (req, res) => {
    try {
        const layout = await Layout.findById(req.params.id);
        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }
        res.status(200).json(layout);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch layout', details: error.message });
    }
});

// Update a layout by ID
router.put('/:id', upload.single('bg_image'), async (req, res) => {
    try {
        const { title, descriptions, "1_text": text1, "2_text": text2, "3_text": text3, "4_text": text4 } = req.body;
        const updatedData = {
            title,
            descriptions,
            "1_text": JSON.parse(text1),
            "2_text": JSON.parse(text2),
            "3_text": JSON.parse(text3),
            "4_text": JSON.parse(text4)
        };

        if (req.file) {
            updatedData.bg_images = `/uploads/layout/${req.file.filename}`;
        }

        const layout = await Layout.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }

        res.status(200).json({ message: 'Layout updated successfully', layout });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update layout', details: error.message });
    }
});

// Delete a layout by ID
router.delete('/:id', async (req, res) => {
    try {
        const layout = await Layout.findByIdAndDelete(req.params.id);
        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }
        res.status(200).json({ message: 'Layout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete layout', details: error.message });
    }
});

module.exports = router;
