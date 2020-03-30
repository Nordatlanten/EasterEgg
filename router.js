const express = require('express')

const router = express.Router()
const consumer = require('./routes/consumer.js')
const producer = require('./routes/producer.js')

router.use('/', consumer, producer)

module.exports = router
