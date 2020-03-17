const mongoose = require('mongoose')
const validator = require('validator')

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'Food'
    },
    amount: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isCurrency(value)) {
                throw new Error('Amount must be a positive number')
            }
        }
    }
})

const Transaction = mongoose.model(transactionSchema)

module.exports = Transaction