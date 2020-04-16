const express = require('express')

const producerlogin = express.Router()

const pool = require('../pool.js')

producerlogin.route('/producer').get((req, res) => {
    res.render('./producerlogin.ejs')
})

producerlogin.route('/auth').post((req, res) => {
    let user = req.body.username
    let pass = req.body.password
    let query = `SELECT * FROM credentials WHERE user = ? AND password = ?`

    if (user && pass) {
        pool((err, connection) => {
            connection.query(query, [user, pass], (err, result, fields) => {
                if (err) throw err
                if (result.length > 0) {
                    req.session.loggedin = true
                    req.session.username = user

                    res.redirect(`/producer/${user}`)
                } else {
                    res.send('Incorrect username and/or password')
                }
                res.end()
            })
        })
    } else {
        res.send('Please enter Username and Password!')
        res.end()
    }
})

module.exports = producerlogin
