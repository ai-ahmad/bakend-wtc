const express = require('express');
const mongoose = require('mongoose');
const TypeLayoutAbout = require('../models/AboutTypeModels'); // Ensure this path is correct

const router = express.Router();

router.post('/create', async (req, res) => {
    console.log('Request Body:', req.body);  // Log the incoming request body to the console
    try {
        const { type } = req.body;

        // Ensure type is provided
        if (!type) {
            return res.status(400).json({ message: "Type is required" });
        }

        // Create and save the new TypeLayoutAbout
        const newLayout = await TypeLayoutAbout.create({ type });

        res.status(201).json({ message: "TypeLayoutAbout created successfully", data: newLayout });
    } catch (error) {
        console.error('Error details:', error);  // Log the full error for debugging
        res.status(500).json({ message: "Error creating TypeLayoutAbout", error: error.message });
    }
});


// Get all AboutTypes
router.get('', async (req, res) => {
    try {
        const aboutTypes = await TypeLayoutAbout.find();
        res.status(200).json(aboutTypes);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: "Error fetching AboutTypes", error: error.message });
    }
});

// Get a single AboutType by ID
router.get('/about-type/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const aboutType = await TypeLayoutAbout.findById(id);
        if (!aboutType) {
            return res.status(404).json({ message: "AboutType not found" });
        }
        res.status(200).json(aboutType);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: "Error fetching AboutType", error: error.message });
    }
});

// Update an AboutType by ID
router.put('/about-type/:id', async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    try {
        const updatedAboutType = await TypeLayoutAbout.findByIdAndUpdate(id, { type }, { new: true });
        if (!updatedAboutType) {
            return res.status(404).json({ message: "AboutType not found" });
        }
        res.status(200).json({ message: "AboutType updated successfully", data: updatedAboutType });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: "Error updating AboutType", error: error.message });
    }
});

// Delete an AboutType by ID
router.delete('/about-type/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAboutType = await TypeLayoutAbout.findByIdAndDelete(id);
        if (!deletedAboutType) {
            return res.status(404).json({ message: "AboutType not found" });
        }
        res.status(200).json({ message: "AboutType deleted successfully" });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: "Error deleting AboutType", error: error.message });
    }
});

module.exports = router;
