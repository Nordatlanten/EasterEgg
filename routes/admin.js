const express = require('express')

const admin = express.Router()
const ObjectId = require('mongodb').ObjectID

const { MongoClient } = require('mongodb')

const pw = require('../pw.js')

const uri = pw.mdbConnect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let db

client.connect(err => {
    if (err) console.log(err)
    db = client.db('candydb').collection('producers')
})

// Route för att lägga till och ta bort leverantörer.
admin
    .route('/admin')
    .get((req, res) => {
        db.find().toArray((err, results) => {
            if (err) console.log(err)
            console.log(results)
            res.render('./admin.ejs', { producers: results })
        })
    })
    .post((req, res) => {
        db.insertOne(req.body, (err, result) => {
            if (err) console.log(err)
            console.log(`${req.body.producer} added.`)
        })
        res.redirect('/admin')
    })
    .delete((req, res) => {
        const { id } = req.body
        db.deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            res.send({ message: 'Godis bortplockad' })
        })
    })

module.exports = admin
