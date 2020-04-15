const express = require('express')

const producerlogin = express.Router()

const pool = require('../pool.js')

const pw = require('../pw.js')


let db

producerlogin.route('/producer').get((req, res) => {
    let query = `SELECT * FROM credentials`

    pool((err, connection) => {
        connection.query(query, (err, result, fields) => {
            connection.release()
            console.log(result)
            if (err) throw err

            res.render('./producerlogin.ejs', { creds: result})
        })
    })
})

module.exports = producerlogin