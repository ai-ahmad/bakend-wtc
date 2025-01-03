const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require('../models/ProdutModel');

const router = express.Router();

// Папки для изображений и PDF
const productImageDir = './uploads/product';
const pdfDir = './uploads/pdf';

// Создаём (если нет)
if (!fs.existsSync(productImageDir)) {
  fs.mkdirSync(productImageDir, { recursive: true });
}
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Настраиваем Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Если это PDF => кладём в ./uploads/pdf, иначе в ./uploads/product
    if (file.mimetype === 'application/pdf') {
      cb(null, pdfDir);
    } else {
      cb(null, productImageDir);
    }
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ========== CREATE Product ==========
router.post('/create', upload.fields([
  { name: 'all_images', maxCount: 10 },
  { name: 'main_images', maxCount: 1 },
  { name: 'product_info_pdf', maxCount: 1 },
]), async (req, res) => {
  const { name, category, rating, price, volume, description, discount_price, promotion, stock, ruler, oils_type, fidbek } = req.body;

  const allImages = req.files['all_images']
    ? req.files['all_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const mainImages = req.files['main_images']
    ? req.files['main_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const productInfoPdf = req.files['product_info_pdf']
    ? `/uploads/pdf/${req.files['product_info_pdf'][0].filename}`
    : '';

  try {
    const newProduct = new Product({
      name,
      category,
      rating,
      price,
      volume,
      stock,
      ruler,
      description,
      fidbek,
      image: {
        main_images: mainImages,
        all_images: allImages,
      },
      product_info_pdf: productInfoPdf,
      discount_price,
      promotion,
      oils_type,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// ========== READ Product by ID ==========
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// ========== READ all Products ==========
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// ========== UPDATE Product by ID ==========
router.put('/:id', upload.fields([
  { name: 'all_images', maxCount: 10 },
  { name: 'main_images', maxCount: 1 },
  { name: 'product_info_pdf', maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const { name, category, rating, price, volume, description, discount_price, promotion, stock, ruler, oils_type } = req.body;

  // Новые файлы, если пришли
  const allImages = req.files['all_images']
    ? req.files['all_images'].map(file => `/uploads/product/${file.filename}`)
    : null;
  const mainImages = req.files['main_images']
    ? req.files['main_images'].map(file => `/uploads/product/${file.filename}`)
    : null;
  const productInfoPdf = req.files['product_info_pdf']
    ? `/uploads/pdf/${req.files['product_info_pdf'][0].filename}`
    : null;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        rating,
        price,
        volume,
        description,
        discount_price,
        promotion,
        stock,
        ruler,
        oils_type,
        // Если массив allImages пришёл, обновим image.all_images
        ...(allImages && { 'image.all_images': allImages }),
        ...(mainImages && { 'image.main_images': mainImages }),
        ...(productInfoPdf && { product_info_pdf: productInfoPdf }),
      },
      { new: true, omitUndefined: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// ========== DELETE Product by ID ==========
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // При желании можно удалить связанные картинки/пдф с диска
    // если вы храните их пути в deletedProduct.image.all_images, deletedProduct.image.main_images, deletedProduct.product_info_pdf

    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// ========== FILTER Products by Category ==========
router.get('/filters', async (req, res) => {
  const { category_name } = req.query;
  try {
    const products = category_name && category_name !== 'all'
      ? await Product.find({ category: category_name })
      : await Product.find();
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ message: 'Error getting data', error: err.message });
  }
});

module.exports = router;
