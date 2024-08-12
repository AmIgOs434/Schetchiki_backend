
require('dotenv').config()
const express = require('express')
const sequelize =require('./db')
const moduls = require('./models/models.js')
const PORT = process.env.PORT || 5000
const app = express()
const cors = require('cors')
const router = require('./routes')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')


app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate() // Подключение к бд
        await sequelize.sync() // сверяет состояние базы данных со схемой бд
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()