const express = require('express')
const pool = require('../pool.js')
const async = require('async')

const consumer = express.Router()

const { MongoClient } = require('mongodb')

const pw = require('../pw.js')

const uri = pw.mdbConnect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let db

client.connect(err => {
    if (err) console.log(err)
    db = client.db('candydb').collection('producers')
})

consumer
    .route('/eggs')
    .get((req, res) => {
        let query = `SELECT * FROM eggs`

        pool((err, connection) => {
            connection.query(query, (err, result, fields) => {
                connection.release()

                if (err) throw err

                res.send(result)
            })
        })
    })
    .post((req, res) => {
        let query = `INSERT INTO eggs (name) VALUES (?)`
        let values = [req.body.eggName]
        console.log(req.body.eggName)
        pool((err, connection) => {
            connection.query(query, values, (err, result, fields) => {
                connection.release()

                if (err) throw err

                res.send(result)
            })
        })
    })

consumer
    .route('/addedCandy')
    .get((req, res) => {
        let query = `SELECT * FROM addedCandy`

        pool((err, connection) => {
            connection.query(query, (err, result, fields) => {
                connection.release()

                if (err) throw err

                res.send(result)
            })
        })
    })


    .post((req, res) => {
        let eggName = req.body.name
        let candyList = req.body.candyList

        let query = `INSERT INTO addedCandy (eggName, name, amount, price) VALUES (?, ?, ?, ?)`

        

        pool((err, connection) => {
            async.forEachOf(candyList, function(candy, i, inner_callback) {
                let values = [eggName, candy.name, candy.amount, candy.price]

                connection.query(query, values, (err, result, fields) => {
                    connection.release()
                    if (err) throw err
                    res.send(result)
                })
            })
        })
    })

consumer.route('/consumer/:userid').get((req, res) => {
    db.aggregate([{ $unwind: '$products' }]).toArray((err, results) => {
        if (err) console.log(err)

        let query = `SELECT * FROM addedCandy WHERE userid = ?`
        const { userid } = req.params

        pool((err, connection) => {
            connection.query(query, userid, (err, result, fields) => {
                connection.release()
                if (err) throw err
                const egg = {}
                for (let n = 0; n < result.length; n++) {
                    if (egg[result[n].eggName] === undefined) {
                        egg[result[n].eggName] = 1
                        const test = []
                        egg[result[n].eggName] = test
                        n--
                    } else {
                        egg[result[n].eggName].push({
                            name: result[n].name,
                            amount: result[n].amount,
                            price: result[n].price,
                        })
                    }
                }
                res.render('./consumer.ejs', { c: results, d: egg })
            })
        })
    })
})

module.exports = consumer
