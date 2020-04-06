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
    .route('/producer/:producer')
    .get((req, res) => {
        db.find({ producer: req.params.producer }).toArray((err, results) => {
            if (err) console.log(err)
            res.render('./producer.ejs', { p: results[0] })
        })
    })
    .post((req, res) => {
        const newProduct = req.body
        const insertProduct = {
            name: newProduct.name,
            type: newProduct.type,
            price: parseInt(newProduct.price),
            additional: newProduct.additional,
            stock: parseInt(newProduct.stock),
        }

        db.updateMany(
            { producer: req.params.producer, 'products.name': { $ne: newProduct.name } },
            { $push: { products: insertProduct } },
            (err, result) => {
                if (err) console.log(err)
                console.log(`${newProduct.name} added.`)
                res.redirect(`/producer/${req.params.producer}`)
            }
        )
    })

producer
    .route('/producer')
    .delete((req, res) => {
        const { name } = req.body
        const { producerName } = req.body
        db.updateMany({ producer: producerName }, { $pull: { products: { name } } }, (err, result) => {
            if (err) return res.send(500, err)
            res.send({ message: 'Godis bortplockad' })
        })
    })
    .put((req, res) => {
        const { product } = req.body
        const increaseNumber = parseInt(req.body.stock)
        const { producerName } = req.body

        db.updateMany(
            { producer: producerName, 'products.name': product },
            { $inc: { 'products.$.stock': increaseNumber } },
            (err, result) => {
                if (err) console.log(err)
                res.send({ message: 'Lagret uppdaterat' })
                console.log(`${increaseNumber} added to ${product}.`)
            }
        )
    })

module.exports = producer
