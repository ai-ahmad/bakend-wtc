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

// ===== CREATE News =====
router.post('/create', upload.array('images', 5), async (req, res) => { 
  // Сохраняем физический путь (например "./uploads/news/..."), 
  // но в БД обычно лучше хранить путь для отдачи, типа "/uploads/news/..."
  // Поэтому можно заменить ниже на: `/uploads/news/${file.filename}`
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

// ===== GET All News =====
router.get('/', async (req, res) => {
  try {
    const newsArticles = await NewsWTC.find();
    res.status(200).json(newsArticles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== GET News by ID =====
router.get('/:id', getNews, (req, res) => {
  res.status(200).json(res.news);
});

// ===== UPDATE News (PATCH) =====
router.patch('/:id', upload.array('images', 5), getNews, async (req, res) => {
  if (req.files && req.files.length > 0) {
    // Аналогично, лучше сохранить в /uploads/news/... для фронтенда
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

// ===== DELETE News =====
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await NewsWTC.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News article not found' });
    }
    // Можете добавить логику удаления файлов из "./uploads/news/" 
    // (if нужно, см. пример в productRoutes)

    res.status(200).json({ message: 'News article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
