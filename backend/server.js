const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const{errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const AdminBro = require('admin-bro')
const mongooseAdminBro = require('@admin-bro/mongoose')
const expressAdminBro = require('@admin-bro/express')
const port = process.env.PORT || 5000
connectDB()

const app = express()


const Flights = require('./models/flightModel')
const User = require('./models/userModel')


AdminBro.registerAdapter(mongooseAdminBro)
const AdminBroOptions = {
  resources: [Flights, User],
}

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminBro.buildRouter(adminBro)


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api/flights', require('./routes/flightRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use(errorHandler)
app.use(adminBro.options.rootPath,router)


app.listen(port, () => console.log(`Server started on port ${port}`))