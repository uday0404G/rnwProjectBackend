const express = require('express')
require('dotenv').config()
const connection = require('./Config/Config')
const cors = require('cors')
const userRoute = require('./Routes/userRoute')
const app = express()
const port = process.env.PORT||3000


app.use(express.json())
app.use(cors())
app.use('/user', userRoute)
app.use("/courses", courseRoutes);





app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, async () => {
    await connection()
    console.log(`Example app listening on port ${port}!`)

})