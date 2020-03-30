const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const router = require('./router.js')

app.use('/', router)

app.listen(8081, () => {
    console.log('Lyssnar på 8081')
})
