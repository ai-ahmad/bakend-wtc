const express = require('express');
const LayoutAbout1 = require('../models/LayouModels');
const LayoutAbout2  = require('../models/LayouModels'); 
const LayoutAbout3  = require('../models/LayouModels'); 
const LayoutAbout4  = require('../models/LayouModels'); 
const LayoutAbout5  = require('../models/LayouModels'); 
const LayoutAbout6  = require('../models/LayouModels'); 
const LayoutAbout7  = require('../models/LayouModels'); 
const LayoutAbout8  = require('../models/LayouModels'); 
const LayoutAbout9  = require('../models/LayouModels'); 
const LayoutAbout10  = require('../models/LayouModels');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/layouts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/abouts', async (req, res) => {
    try {
        const layouts1 = await LayoutAbout1.find();
        const layouts2 = await LayoutAbout2.find();
        const layouts3 = await LayoutAbout3.find();
        const layouts4 = await LayoutAbout4.find();
        const layouts5 = await LayoutAbout5.find();
        const layouts6 = await LayoutAbout6.find();
        const layouts7 = await LayoutAbout7.find();
        const layouts8 = await LayoutAbout8.find();
        const layouts9 = await LayoutAbout9.find();
        const layouts10 = await LayoutAbout10.find();
        const all_layouts = [layouts1, layouts2, layouts3, layouts4, layouts5, layouts6, layouts7, layouts8, layouts9, layouts10];
        res.status(200).json({ data: all_layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// Get all LayoutAbout1 entries
router.get('/layout/about/1', async (req, res) => {
    try {
        const layouts = await LayoutAbout1.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Get LayoutAbout1 by ID
router.get('/laoyut/about/1/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// Create LayoutAbout1 with image upload
router.post('/create/layout/about/1', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout1({ description, title, bg_color, buttons, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

// Update LayoutAbout1 by ID
router.put('/update/layout/about/1/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.buttons = buttons || layout.buttons;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

// Delete LayoutAbout1 by ID
router.delete('/update/laout/about/1/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout1.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});




module.exports = router;
