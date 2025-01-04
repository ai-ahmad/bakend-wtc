// src/router/ApplicationRouter.js

const express = require('express')
const Application = require('../models/ApplicationModel')

const router = express.Router()

// ========================
//   GET All Applications
// ========================
/**
 * @swagger
 * /applications:
 *   get:
 *     tags:
 *       - Applications
 *     description: Get all applications
 *     responses:
 *       200:
 *         description: A list of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   full_name:
 *                     type: string
 *                   telephone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   application_type:
 *                     type: string
 *                   message:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find()
        res.json(applications)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// ========================
//   CREATE Application
// ========================
/**
 * @swagger
 * /applications/create:
 *   post:
 *     tags:
 *       - Applications
 *     description: Create a new application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               application_type:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       500:
 *         description: Server error
 */
router.post('/create', async (req, res) => {
    const { full_name, telephone, email, application_type, message } = req.body
    try {
        const new_application = new Application({ full_name, telephone, email, application_type, message })
        await new_application.save()
        res.status(201).json(new_application)
    }catch (err) { 
        res.status(500).json({ message: err.message })
    }
})

// ========================
//   UPDATE Application
// ========================
/**
 * @swagger
 * /applications/update/{id}:
 *   put:
 *     tags:
 *       - Applications
 *     description: Update an application by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               application_type:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', async (req, res) => {
    const { id } = req.params
    const { full_name, telephone, email, application_type, message } = req.body
    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { full_name, telephone, email, application_type, message },
            { new: true } // This will return the updated document
        )

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' })
        }

        res.json(updatedApplication)
    }catch (err) { 
        res.status(500).json({ message: err.message })
    }
})

// ========================
//   DELETE Application
// ========================
/**
 * @swagger
 * /applications/delete/{id}:
 *   delete:
 *     tags:
 *       - Applications
 *     description: Delete an application by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleted_application = await Application.findByIdAndDelete(id)
        if (!deleted_application) return res.status(404).json({ message: 'Application not found' })
        res.json(deleted_application)
    }catch (err) { 
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
