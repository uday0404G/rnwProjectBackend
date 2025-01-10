
const mongoose = require('mongoose')

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection
PORT=8080
MONGO_URI=mongodb+srv://udaylashkari2:Lashkari@cluster0.zllfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=udaylashkari
