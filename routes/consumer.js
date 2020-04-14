// Initierar express, mongodb & mysql

const express = require('express')
const pool = require('../pool.js')

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

//

// Behövs koden nedan?
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

// Route som hämtar godis till konsumentsidan.
consumer
    .route('/consumer/:userid')

    .get((req, res) => {
        const filterBy = req.query.filter
        const sortBy = req.query.sort

        let pipeline = [{ $unwind: '$products' }]

        if (sortBy) {
            if (sortBy == 'candyname') {
                pipeline = [{ $unwind: '$products' }, { $sort: { 'products.name': 1 } }]
            } else if (sortBy == 'price') {
                pipeline = [{ $unwind: '$products' }, { $sort: { 'products.price': 1 } }]
            } else if (sortBy == 'producer') {
                pipeline = [{ $unwind: '$products' }, { $sort: { producer: 1 } }]
            }
        }

        if (filterBy) {
            if (Array.isArray(filterBy)) {
                pipeline = [{ $unwind: '$products' }, { $match: { $or: [{ 'products.type': { $in: filterBy } }] } }]
            } else {
                pipeline = [{ $unwind: '$products' }, { $match: { 'products.type': filterBy } }]
            }
        }

        db.aggregate(pipeline).toArray((err, allCandy) => {
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
                            const eggArray = []
                            egg[result[n].eggName] = eggArray
                            n--
                        } else {
                            egg[result[n].eggName].push({
                                name: result[n].name,
                                amount: result[n].amount,
                                price: result[n].price,
                            })
                        }
                    }
                    res.render('./consumer.ejs', { c: allCandy, d: egg, e: userid })
                })
            })
        })
    })

// Route för att lägga till påskägg till kundens personliga lista.
consumer
    .route('/addedCandy/:userid')

    .post(async (req, res) => {
        let eggName = req.body.name
        let { candyList } = req.body
        let { userid } = req.params
        let query = `INSERT INTO addedCandy (eggName, name, amount, price, userid) VALUES (?, ?, ?, ?, ?)`

        pool(async (err, connection) => {
            for (let i = 0; i < candyList.length; i++) {
                let values = [eggName, candyList[i].name, candyList[i].amount, candyList[i].price, userid]

                try {
                    await connection.query(query, values, (err, result, fields) => {
                        if (err) throw err

                        console.log(`Added ${candyList[i].amount} of ${candyList[i].name} to egg "${eggName}"`)
                    })
                } catch (error) {
                    return callback(error)
                }
            }

            connection.release()
        })
    })

module.exports = consumer
