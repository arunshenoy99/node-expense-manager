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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction