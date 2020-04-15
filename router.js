const express = require('express')

const router = express.Router()
const admin = require('./routes/admin.js')
const consumer = require('./routes/consumer.js')
const producer = require('./routes/producer.js')
const producerlogin = require('./routes/producerlogin.js')

router.use('/', admin, consumer, producer, producerlogin)

module.exports = router
