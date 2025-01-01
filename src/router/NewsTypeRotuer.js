const express = require('express');
const router = express.Router();
const NewsCategory = require('../models/NewsCategoryModels');

// Create a new NewsCategory
router.post('/', async (req, res) => {
    const newsCategory = new NewsCategory({
        type: req.body.type,
    });

    try {
        const savedCategory = await newsCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Get all NewsCategories
router.get('/', async (req, res) => {
    try {
        const categories = await NewsCategory.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single NewsCategory by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await NewsCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a NewsCategory by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await NewsCategory.findByIdAndUpdate(
            req.params.id,
            { type: req.body.type },
            { new: true } // Return the updated document
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a NewsCategory by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await NewsCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json({ message: 'NewsCategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
