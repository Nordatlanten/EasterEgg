const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')


// Socket.io setup
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cookie: false})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

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
