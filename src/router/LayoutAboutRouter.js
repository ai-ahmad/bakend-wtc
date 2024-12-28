const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

// Models
const LayoutAbout1 = require('../models/LayoutModels')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/layouts';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Router setup
const router = express.Router();

router.post('/about-create', upload.array('images'), async (req, res) => {
    try {
        const images = req.files.map(file => file.path);
        const { date, description, title, type } = req.body;

        const newLayout = new LayoutAbout1({
            images,
            date,
            description: Array.isArray(description) ? description : [description],
            title,
            type
        });

        await newLayout.save();
        res.status(201).json({ message: 'LayoutAbout1 created successfully', data: newLayout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all LayoutAbout1 entries
router.get('/about', async (req, res) => {
    try {
        const layouts = await LayoutAbout1.find().populate('type');
        res.status(200).json(layouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single LayoutAbout1 entry by ID
router.get('/about/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from route parameters
        const layout = await LayoutAbout1.findById(id);
        if (!layout) {
            return res.status(404).json({ message: 'LayoutAbout1 not found' });
        }
        res.status(200).json(layout); // Return the layout if found
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});


// Update a LayoutAbout1 entry by ID
router.put('/about/:id', upload.array('images'), async (req, res) => {
    try {
        const { date, description, title, type_ } = req.body;
        const images = req.files.map(file => file.path);

        const updatedLayout = await LayoutAbout1.findByIdAndUpdate(
            req.params.id,
            {
                images: images.length ? images : undefined,
                date,
                description: Array.isArray(description) ? description : [description],
                title,
                type_
            },
            { new: true, omitUndefined: true }
        ).populate('type_');

        if (!updatedLayout) {
            return res.status(404).json({ message: 'LayoutAbout1 not found' });
        }

        res.status(200).json({ message: 'LayoutAbout1 updated successfully', data: updatedLayout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a LayoutAbout1 entry by ID
router.delete('/about/:id', async (req, res) => {
    try {
        const deletedLayout = await LayoutAbout1.findByIdAndDelete(req.params.id);
        if (!deletedLayout) {
            return res.status(404).json({ message: 'LayoutAbout1 not found' });
        }
        res.status(200).json({ message: 'LayoutAbout1 deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
 