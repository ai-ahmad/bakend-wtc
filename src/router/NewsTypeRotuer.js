const express = require('express');
const router = express.Router();
const NewsCategory = require('../models/NewsCategoryModels');

/**
 * @swagger
 * /news-type:
 *   post:
 *     summary: Create a new news category
 *     tags: [News Type]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the news category
 *     responses:
 *       201:
 *         description: The news category was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    const newsCategory = new NewsCategory({
        type: req.body.type,
    });

    try {
        const savedCategory = await newsCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /news-category:
 *   get:
 *     summary: Get all news categories
 *     tags: [News Type]
 *     responses:
 *       200:
 *         description: List of all news categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewsCategory'
 *       500:
 *         description: Error retrieving news categories
 */
router.get('/', async (req, res) => {
    try {
        const categories = await NewsCategory.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /news-category/{id}:
 *   get:
 *     summary: Get a single news category by ID
 *     tags: [News Type]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single news category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsCategory'
 *       404:
 *         description: News category not found
 *       500:
 *         description: Error retrieving news category
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await NewsCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /news-category/{id}:
 *   put:
 *     summary: Update a news category by ID
 *     tags: [News Type]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news category
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The new type for the news category
 *     responses:
 *       200:
 *         description: The news category was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsCategory'
 *       400:
 *         description: Bad request
 *       404:
 *         description: News category not found
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await NewsCategory.findByIdAndUpdate(
            req.params.id,
            { type: req.body.type },
            { new: true } // Return the updated document
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /news-category/{id}:
 *   delete:
 *     summary: Delete a news category by ID
 *     tags: [News Type]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The news category was successfully deleted
 *       404:
 *         description: News category not found
 *       500:
 *         description: Error deleting news category
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await NewsCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'NewsCategory not found' });
        }
        res.status(200).json({ message: 'NewsCategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
