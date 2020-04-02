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
    db = client.db('candydb').collection('producers')
})

producer
    .route('/producer')
    .get((req, res) => {
        db.find().toArray((err, results) => {
            if (err) console.log(err)
            // Denna renderar bara fram producent nr4
            res.render('./producer.ejs', { p: results[3] })
        })
    })
    .post((req, res) => {
    
        let newProduct = req.body
        console.log(newProduct)

        db.updateMany({ producer: 'Marabou' }, { $push: { products: req.body } })

        res.redirect('/producer')
    })
    .put((req, res) => {})

    .delete((req, res) => {

        const { id } = req.body
      

        db.updateMany({ producer: 'Marabou' }, { $pull: { 'products': { 'name': id } }
    
        
    })

        
        
        res.send({ message: id + 'bortplockad' })



    })

module.exports = producer
