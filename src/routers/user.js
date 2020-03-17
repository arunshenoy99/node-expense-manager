const express = require('express')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = req.body
    try {
        await user.save()
    } catch (e) {
        res.status(400).send()
    }
})

