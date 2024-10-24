const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModels'); // Make sure the path is correct

// Create a new category
router.post('/', async (req, res) => {
    const category = new Category({
        category_name: req.body.category_name,
    });

    try {
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single category by ID
router.get('/:id', getCategory, (req, res) => {
    res.status(200).json(res.category);
});

// Update a category by ID
router.patch('/:id', getCategory, async (req, res) => {
    if (req.body.category_name != null) {
        res.category.category_name = req.body.category_name;
    }

    try {
        const updatedCategory = await res.category.save();
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a category by ID
router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.remove();
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get category by ID
async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category == null) {
            return res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.category = category;
    next();
}

module.exports = router;
