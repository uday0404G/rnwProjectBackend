const express = require('express')
require('dotenv').config()
const connection = require('./Config/Config')
const cors = require('cors')
const userRoute = require('./Routes/userRoute')
const CourseRoute = require('./Routes/courseRoutes')
<<<<<<< HEAD
const enrollmentRoute = require('./Routes/enrollmentRoutes')
=======
>>>>>>> 3b519d9325aa81aaeb499c208747a215a032b991

const app = express()
const port = process.env.PORT||3000

app.use(express.json())
app.use(cors())
app.use('/user', userRoute)
app.use("/courses", CourseRoute);
app.use("/enrollment", enrollmentRoute);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, async () => {
    await connection()
    console.log(`Example app listening on port ${port}!`)
<<<<<<< HEAD
})
=======

})
>>>>>>> 3b519d9325aa81aaeb499c208747a215a032b991
