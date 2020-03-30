const express = require('express')
const pool = require('../pool.js')

const consumer = express.Router()

consumer.route('/consumer').get((req, res) => {
    res.send('hej')
})

module.exports = consumer
