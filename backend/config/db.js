const mongoose = require('mongoose')

MONGO_URI = 'mongodb+srv://FREDAIR716:FREDAIR716@fredaircluster.gtq4u.mongodb.net/FredAir?retryWrites=true&w=majority'

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB