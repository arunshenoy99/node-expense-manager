require('./db/mongoose.js')
const express = require('express')
const userRouter = require('./routers/user')
const transactionRouter = require('./routers/transaction')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(transactionRouter)

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})

