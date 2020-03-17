const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(404).send()
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(400).send()
    }
}

module.exports = auth