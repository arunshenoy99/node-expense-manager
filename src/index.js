require('./db/mongoose.js')
const express = require('express')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(userRouter)

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})

