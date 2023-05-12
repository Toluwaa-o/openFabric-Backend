//imports
require('dotenv').config()
require('express-async-errors')

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const db = require('./db/connectDb')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderRoutes = require('./routes/orderRoutes')

//initialize app 
const app = express()

//middleware
mongoose.set('strictQuery', false)
app.set('trust proxy', 1)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
    }))

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(express.static('./public'))
app.use(fileUpload())

app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/orders', orderRoutes)

//errorHandlers
app.use(notFound)
app.use(errorHandler)

//port setup
const port = process.env.PORT || 4000

//database connection & server setup
const start = async () => {
    try {
        //connect to database
        await db(process.env.MONGO_URL)
        //start server
        app.listen(port, () => console.log(`Server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

//invoke start
start()
