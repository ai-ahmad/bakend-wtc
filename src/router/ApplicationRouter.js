const express = require('express')
const Application = require('../models/ApplicationModel')

const router = express.Router()


router.get('/', async (req, res) => {
    try {
        const applications = await Application.find()
        res.json(applications)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.post('/create', async (req, res) => {
    const { full_name,telephone,email,application_type,message } = req.body
    try {
        const new_application = await Application(full_name,telephone,email,application_type,message)
        await new_application.save()
        res.status(201).json(new_application)
    }catch (err) { 
        res.status(500).json({ message: err.message })
    }
})

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