const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const NewsWTC = require('../models/NewsModels');

// 1) Путь к папке для новостей
const newsDir = './uploads/news';

// 2) Создаём, если нет
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
}

// 3) Настраиваем Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Сохраняем в ./uploads/news
    cb(null, newsDir); 
  },
  filename: (req, file, cb) => {
    // Добавляем дату к имени
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

/**
 * @swagger
 * /news/create:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               news_type:
 *                 type: string
 *               title:
 *                 type: string
 *               data:
 *                 type: string
 *               descriptions:
 *                 type: string
 *     responses:
 *       201:
 *         description: The news article was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/create', upload.array('images', 5), async (req, res) => { 
  const imagePaths = req.files.map(file => `/uploads/news/${file.filename}`);

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

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news articles
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of all news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       500:
 *         description: Error retrieving news articles
 */
router.get('/', async (req, res) => {
  try {
    const newsArticles = await NewsWTC.find();
    res.status(200).json(newsArticles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get a single news article by ID
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single news article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: News article not found
 *       500:
 *         description: Error retrieving news article
 */
router.get('/:id', getNews, (req, res) => {
  res.status(200).json(res.news);
});

/**
 * @swagger
 * /news/{id}:
 *   patch:
 *     summary: Update a news article by ID
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news article
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               news_type:
 *                 type: string
 *               title:
 *                 type: string
 *               data:
 *                 type: string
 *               descriptions:
 *                 type: string
 *     responses:
 *       200:
 *         description: The news article was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       400:
 *         description: Bad request
 *       404:
 *         description: News article not found
 */
router.patch('/:id', upload.array('images', 5), getNews, async (req, res) => {
  if (req.files && req.files.length > 0) {
    res.news.images = req.files.map(file => `/uploads/news/${file.filename}`);
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

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news article by ID
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The news article was successfully deleted
 *       404:
 *         description: News article not found
 *       500:
 *         description: Error deleting news article
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await NewsWTC.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(200).json({ message: 'News article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the news article
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             description: The URL of the image
 *         news_type:
 *           type: string
 *           description: The type of the news article
 *         title:
 *           type: string
 *           description: The title of the news article
 *         data:
 *           type: string
 *           description: The date of the news article
 *         descriptions:
 *           type: string
 *           description: The descriptions of the news article
 *       required:
 *         - images
 *         - news_type
 *         - title
 *         - data
 *         - descriptions
 */

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management operations
 */

// ===== GET News Middleware =====
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
