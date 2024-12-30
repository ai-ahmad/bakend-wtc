// src/router/AuthRouter.js

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModels'); 

const router = express.Router();

// Route: POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Defensive coding: Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        // Optionally, generate a token here (e.g., JWT) and send it to the client
        res.json({ user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route: POST /auth/create-partnyor
router.post('/create-partnyor', async (req, res) => {
    const { username, password, role } = req.body;

    // Defensive coding: Check if req.body exists
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
    }

    // Validate required fields
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save(); 

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
