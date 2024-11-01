const express = require('express');
const router = express.Router();
const NewsWTC = require('../models/NewsModels');

// Create a new news article
router.post('/create', async (req, res) => {
    const news = new NewsWTC({
        images: req.body.images,
        news_type: req.body.news_type, // Corrected typo here
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
router.patch('/:id', getNews, async (req, res) => {
    if (req.body.images != null) {
        res.news.images = req.body.images;
    }
    if (req.body.news_type != null) { // Corrected typo here
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
