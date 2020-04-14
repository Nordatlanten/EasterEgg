const express = require('express')
const bodyParser = require('body-parser')
const app = express()


//Socket.io setup
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const router = require('./router.js')

app.use('/', router)

let offers = []

io.on('connection', (socket) => {

    socket.on('new offer', (data) => {
        offers.push(data.newOffer)
        console.log(offers)

        
        socket.broadcast.emit('offers', {
            offers: offers
        })
    })

})

server.listen('8081', () => {
    console.log('Lyssnar på 8081')
})
