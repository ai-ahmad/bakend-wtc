const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const NewsWTC = require('../models/NewsModels');

// Resolve the correct path for uploads/news
const uploadsDir = path.resolve(__dirname, './uploads/news');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save files to uploads/news
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Create a news article
router.post('/create', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const imagePaths = req.files.map(file => file.path); // Save file paths

        const news = new NewsWTC({
            images: imagePaths,
            news_type: req.body.news_type,
            title: req.body.title,
            data: req.body.data,
            descriptions: req.body.descriptions
        });

        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Get all news articles
router.get('/', async (req, res) => {
    try {
        const newsArticles = await NewsWTC.find();
        res.status(200).json(newsArticles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Get a specific news article by ID
router.get('/:id', getNews, (req, res) => {
    res.status(200).json(res.news);
});

// Update a news article
router.patch('/:id', upload.array('images', 5), getNews, async (req, res) => {
    try {
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

        const updatedNews = await res.news.save();
        res.status(200).json(updatedNews);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a news article
router.delete('/:id', async (req, res) => {
    try {
        const deletedNews = await NewsWTC.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.status(200).json({ message: 'News article deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a specific news article by ID
async function getNews(req, res, next) {
    try {
        const news = await NewsWTC.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.news = news;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = router;
