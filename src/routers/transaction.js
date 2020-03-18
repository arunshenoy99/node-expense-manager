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


//use query string to specify category
//Ex: category=food
// sort by amount or created
//Ex: sortBy=amount_sort or createdAt_sort where sort=ASC|DESC
//Specify pagination by limit=Number and skip=Number
router.get('/transactions', auth, async (req, res) => {
    const category = req.query.category
    const match = {}
    const sort = {}
    if (category) {
        match.category = category
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1].toLowerCase() == 'desc'? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'transactions',
            match,
            options: {
                limit: req.query.limit,
                skip: req.query.skip,
                sort
            }
        }).execPopulate()
        let total = 0
        req.user.transactions.forEach((transaction) => {
            const amount = parseFloat(transaction.amount)
            total = total + amount
        })
        res.send({ transactions:req.user.transactions, totalSpent: total})
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