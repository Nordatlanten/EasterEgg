const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Socket.io setup
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const router = require('./router.js')

app.use('/', router)

io.on('connection', socket => {
    socket.on('new offer', data => {
        socket.broadcast.emit('offers', {
            producer: data.producer,
            newOffer: data.newOffer,
        })
    })
})

server.listen('8081', () => {
    console.log('Lyssnar på 8081')
})
