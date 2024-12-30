const express = require('express');
const router = express.Router();
const NewsCategory = require('../models/NewsCategoryModels'); // Adjust path as necessary

// Create a new NewsCategory
router.post('/create', async (req, res) => {
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
router.get('/:id', getNewsCategory, (req, res) => {
    res.status(200).json(res.newsCategory);
});

// Update a NewsCategory by ID
router.patch('/:id', getNewsCategory, async (req, res) => {
    if (req.body.type != null) {
        res.newsCategory.type = req.body.type;
    }

    try {
        const updatedCategory = await res.newsCategory.save();
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a NewsCategory by ID
// Delete a NewsCategory by ID
router.delete('/:id', getNewsCategory, async (req, res) => {
    try {
        await res.newsCategory.deleteOne(); // Удаление категории
        res.status(200).json({ message: 'NewsCategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Middleware to get a single NewsCategory by ID
async function getNewsCategory(req, res, next) {
    let newsCategory;
    try {
        newsCategory = await NewsCategory.findById(req.params.id);
        if (newsCategory == null) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.newsCategory = newsCategory;
    next();
}

module.exports = router;
