const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'Others'
    },
    amount: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Amount must be a positive number')
            }
        }
    }
})

const Transaction = mongoose.model(transactionSchema)

module.exports = Transaction