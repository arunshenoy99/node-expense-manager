const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        min: 6,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const User = mongoose.model(userSchema)

module.exports = User