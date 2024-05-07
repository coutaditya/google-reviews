const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mainRouter = require("./routes/index")
const cors = require("cors");

app.use(bodyParser.json())

app.use(cors())

app.use("/api/v1", mainRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
