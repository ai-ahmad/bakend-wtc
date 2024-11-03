const express = require('express');
const CategoryNewsModel = require('../models/CategoryModels');
const router = express.Router();

// GET route to retrieve all news categories
router.get('/', async (req, res) => {
    try {
        const categoryData = await CategoryNewsModel.find();
        res.json(categoryData);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving categories" });
    }
});

// POST route to create a new news category
router.post('/create', async (req, res) => {
    const { category_name } = req.body;
    try {
        const newCategory = new CategoryNewsModel({ category_name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT route to update a specific news category by ID
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!id) return res.status(400).json({ message: 'No category ID provided' });

    try {
        const updatedCategory = await CategoryNewsModel.findByIdAndUpdate(id, { category_name }, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE route to remove a specific news category by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await CategoryNewsModel.findByIdAndDelete(id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
