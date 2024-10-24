const express = require('express');
const LayoutModel = require('../models/LayouModels'); // Assuming it's saved as LayoutModel.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/layouts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/layouts'); // Destination for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Filename with timestamp
    }
});

const upload = multer({ storage: storage });

// Get all layouts
router.get('/', async (req, res) => {
    try {
        const layouts = await LayoutModel.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Get layout by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const layout = await LayoutModel.findById(id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Create a new layout
router.post('/create', upload.array('images', 5), async (req, res) => {
    const { title, description, layout_text_position, layout_images_position } = req.body;
    const images = req.files.map(file => file.path);

    try {
        if (!title || !description || !layout_text_position || !layout_images_position) {
            return res.status(400).json({ data: 'All fields are required.' });
        }

        if (images.length < 1) {
            return res.status(400).json({ data: 'At least one image must be uploaded.' });
        }

        const layout = new LayoutModel({
            title,
            description,
            layout_text_position,
            layout_images_position,
            images
        });

        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

// Update an existing layout by ID
router.put('/:id', upload.array('images', 5), async (req, res) => {
    const { id } = req.params;
    const { title, description, layout_text_position, layout_images_position } = req.body;
    const images = req.files.map(file => file.path);

    try {
        // Find the layout by ID
        const layout = await LayoutModel.findById(id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        // Update fields
        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.layout_text_position = layout_text_position || layout.layout_text_position;
        layout.layout_images_position = layout_images_position || layout.layout_images_position;

        if (images.length > 0) {
            // Delete old images from the filesystem
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) {
                    fs.unlinkSync(fullImagePath); // Remove old image file
                }
            });
            layout.images = images; // Set new images
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

// Delete a layout by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const layout = await LayoutModel.findById(id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        // Delete associated images from the file system
        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath); // Remove old image file
            }
        });

        await LayoutModel.findByIdAndDelete(id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

module.exports = router;
