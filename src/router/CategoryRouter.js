const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModels'); // Ensure the path is correct
const mongoose = require('mongoose');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    next();
}

// Middleware to get category by ID
async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}

// Create a new category
router.post('/create', async (req, res) => {
    if (!req.body.category_name || req.body.category_name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required' });
    }   

    const category = new Category({
        category_name: req.body.category_name.trim(),
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
router.get('/:id', validateObjectId, getCategory, (req, res) => {
    res.status(200).json(res.category);
});

// Update a category by ID
router.patch('/:id', validateObjectId, getCategory, async (req, res) => {
    if (req.body.category_name && req.body.category_name.trim() !== '') {
        res.category.category_name = req.body.category_name.trim();
    } else {
        return res.status(400).json({ message: 'Category name is required for update' });
    }

    try {
        const updatedCategory = await res.category.save();
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a category by ID
router.delete('/:id', validateObjectId, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
