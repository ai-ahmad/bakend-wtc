const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const NewsWTC = require('../models/NewsModels');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/news'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
}); 
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});
router.post('/create', upload.array('images', 5), async (req, res) => { 
    const imagePaths = req.files.map(file => file.path); 

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

router.get('/', async (req, res) => {
    try {
        const newsArticles = await NewsWTC.find();
        res.status(200).json(newsArticles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getNews, (req, res) => {
    res.status(200).json(res.news);
});

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

router.delete('/:id', async (req, res) => {
    try {
        const deletedNews = await NewsWTC.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.status(200).json({ message: 'News article deleted successfully' });
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
