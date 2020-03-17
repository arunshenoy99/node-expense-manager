const Transaction = require('../models/transaction')
const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/transactions', auth, async (req, res) => {
    const transaction = new Transaction(req.body)
    try {
        transaction.owner = req.user._id
        await transaction.save()
        res.send({ transaction })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/transactions', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'transactions'
        }).execPopulate()
        res.send(req.user.transactions)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/transactions/:id', auth, async (req, res) => {
    const allowedUpdates = ['category', 'amount', 'description']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send()
    } 
    try {
        const transaction = await Transaction.findById(req.params.id)
        if (!transaction) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            transaction[update] = req.body[update]
        })
        await transaction.save()
        res.send({ transaction })
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/transactions/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
        if (!transaction) {
            return res.status(404).send()
        }
        await transaction.remove()
        res.send(transaction)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router