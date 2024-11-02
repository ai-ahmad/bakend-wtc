const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const NewsWTC = require('../models/NewsModels');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/news'); // Set the directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Name the file with a timestamp and original name
    }
}); 

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB
});

// Create a new news article with image upload
router.post('/create', upload.array('images', 5), async (req, res) => { // Allow up to 5 images
    const imagePaths = req.files.map(file => file.path); // Store image file paths

    const news = new NewsWTC({
        images: imagePaths,
        news_type: req.body.news_type,
        title: req.body.title,
        data: req.body.data,
        descriptions: req.body.descriptions
    });

    try {
        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all news articles
router.get('/', async (req, res) => {
    try {
        const newsArticles = await NewsWTC.find();
        res.status(200).json(newsArticles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single news article by ID
router.get('/:id', getNews, (req, res) => {
    res.status(200).json(res.news);
});

// Update a news article by ID
router.patch('/:id', upload.array('images', 5), getNews, async (req, res) => {
    if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map(file => file.path);
        res.news.images = imagePaths;
    }
    if (req.body.news_type != null) {
        res.news.news_type = req.body.news_type;
    }
    if (req.body.title != null) {
        res.news.title = req.body.title;
    }
    if (req.body.descriptions != null) {
        res.news.descriptions = req.body.descriptions;
    }
    if (req.body.data != null) {
        res.news.data = req.body.data;
    }

    try {
        const updatedNews = await res.news.save();
        res.status(200).json(updatedNews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a news article by ID
router.delete('/:id', getNews, async (req, res) => {
    try {
        await res.news.remove();
        res.status(200).json({ message: 'News article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get news by ID
async function getNews(req, res, next) {
    let news;
    try {
        news = await NewsWTC.findById(req.params.id);
        if (news == null) {
            return res.status(404).json({ message: 'News article not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.news = news;
    next();
}

module.exports = router;
