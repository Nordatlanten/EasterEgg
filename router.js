const express = require('express')

const router = express.Router()
const admin = require('./routes/admin.js')
const consumer = require('./routes/consumer.js')
const producer = require('./routes/producer.js')

router.use('/', admin, consumer, producer)

module.exports = router
