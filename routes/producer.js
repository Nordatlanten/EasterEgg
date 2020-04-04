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
        const newProduct = req.body
        const insertProduct = {
            name: newProduct.name,
            type: newProduct.type,
            price: parseInt(newProduct.price),
            additional: newProduct.additional,
            stock: parseInt(newProduct.stock),
        }

        db.updateMany(
            { producer: 'Marabou', 'products.name': { $ne: newProduct.name } },
            { $push: { products: insertProduct } },
            (err, result) => {
                if (err) console.log(err)
                console.log(`${newProduct.name} added.`)
                res.redirect('/producer')
            }
        )
    })
    .put((req, res) => {
        const { product } = req.body
        const increaseNumber = parseInt(req.body.stock)

        db.updateMany(
            { producer: 'Marabou', 'products.name': product },
            { $inc: { 'products.$.stock': increaseNumber } },
            (err, result) => {
                if (err) console.log(err)
                res.send({ message: 'Lagret uppdaterat' })
                console.log(`${increaseNumber} added to ${product}.`)
            }
        )
    })

    .delete((req, res) => {
        const { name } = req.body
        db.updateMany({ producer: 'Marabou' }, { $pull: { products: { name } } }, (err, result) => {
            if (err) return res.send(500, err)
            res.send({ message: 'Godis bortplockad' })
        })
    })

module.exports = producer
