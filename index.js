require('dotenv').config()
const https = require('https');
const express = require('express')
const sequelize =require('./db')
const moduls = require('./models/models.js')
const PORT = process.env.PORT || 5000
const app = express()
const cors = require('cors')
const router = require('./routes')
const fileUpload = require('express-fileupload')

const path = require('path')
const fs = require('fs');


app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)


const options = {
    key: fs.readFileSync(`./cert/privkey.pem`),
    cert: fs.readFileSync(`./cert/fullchain.pem`)
  };
  
//   https.createServer(options, (req, res) => {res.writeHead(200);}).listen(8000);



const start = async () => {
    try {
 
        await sequelize.authenticate() // Подключение к бд
        await sequelize.sync() // сверяет состояние базы данных со схемой бд
        app.listen(8080);
        https.createServer(options, app).listen(8443);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    
    
    } catch (e) {
        console.log(e)
    }
}

start()