const express = require('express')

const producer = express.Router()
const ObjectId = require('mongodb').ObjectID

const { MongoClient } = require('mongodb')
const pool = require('../pool.js')

const pw = require('../pw.js')

const uri = pw.mdbConnect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let db

client.connect(err => {
    if (err) console.log(err)
    db = client.db('candydb').collection('candy')
})

producer.route('/sqltest').get((req, res) => {
    let query = `SELECT * FROM Producers`

    pool((err, connection) => {
        connection.query(query, (err, result, fields) => {
            connection.release()

            if (err) throw err

            res.send(result)
        })
    })
})

producer
    .route('/producer')
    .get((req, res) => {
        db.find().toArray((err, results) => {
            if (err) console.log(err)
            res.render('./producer.ejs', { candy: results })
        })
    })
    .post((req, res) => {
        
        req.body.nuts ? req.body.nuts = 1 : req.body.nuts = 0
        req.body.gelatine ? req.body.gelatine = 1 : req.body.gelatine = 0
        req.body.gluten ? req.body.gluten = 1 : req.body.gluten = 0
        req.body.natural ? req.body.natural = 1 : req.body.natural = 0
      
        db.insertOne(req.body, (err, result) => {
            console.log(req.body)
          
            if (err) console.log(err)
            console.log(`${req.body.name} added.`)
        })
        res.redirect('/producer')
    })
    .delete((req, res) => {
        const { id } = req.body
        db.deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            res.send({ message: 'Godis bortplockad' })
        })
    })

module.exports = producer
