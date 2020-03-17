const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        if (!user) {
            throw new Error('Please provide a valid user')
        }
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send()
        }
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.status(404).send()
        }
        const token = await user.generateAuthToken()
        return res.send({ user, token })
    } catch (e) {
        return res.status(400).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['email', 'name', 'password']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    try {
        if (!isValidUpdate) {
            return res.status(400).send()
        }
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send({ user })
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router