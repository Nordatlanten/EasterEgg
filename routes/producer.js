const express = require('express')

const producer = express.Router()
const ObjectId = require('mongodb').ObjectID
const { MongoClient } = require('mongodb')
const pool = require('../pool.js')

// Våra kredentialer finns i variabel pw.
const pw = require('../pw.js')

//Användares kredentialer finns i variabel credentials
const credentials = require('../credentials')

const uri = pw.mdbConnect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })


let db

client.connect(err => {
    if (err) console.log(err)
    db = client.db('candydb').collection('producers')
})




producer
    .route('/auth')
        .post((req, res) => {
            let user = req.body.username
            let pass = req.body.password
            let query = `SELECT * FROM credentials WHERE user = ? AND password = ?`

            console.log(user, pass)

            if(user && pass) {

                pool((err, connection) => {
                    
                    connection.query(query, [user, pass], (err, result, fields) => {
                        if (err) throw err

                        console.log(result)
                        if (result.length > 0) {
                            let key = result[0].apikey
                        req.session.loggedin = true
                        req.session.username = user
                        
                        res.redirect('/producer/' + key + '/' + user.charAt(0).toUpperCase() + 
                        user.slice(1) )
                        } else {
                            res.send('Incorrect username and/or password')
                        }
                    res.end()
                })
            
            }) } else {
                    res.send('Please enter Username and Password!')
                    res.end()
                }
            })
        

 
            
producer
    .route('/producer/:apikey/:producer')
    .get((req, res) => {

    

        db.find({ producer: req.params.producer }).toArray((err, results) => {
            if (err) console.log(err)
            res.render('./producer.ejs', { p: results[0]})
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

// producer
//     .route('/producer')
//     .delete((req, res) => {
//         const { currentProducer } = req.body
//         const { clickedProduct } = req.body
//         db.updateMany(
//             { producer: currentProducer },
//             { $pull: { products: { name: clickedProduct } } },
//             (err, result) => {
//                 if (err) return res.send(500, err)
//                 res.send({ message: 'Godis bortplockad' })
//             }
//         )
//     })
//     .put((req, res) => {
//         const { clickedProduct } = req.body
//         const amountToRefill = parseInt(req.body.amountToRefill)
//         const { currentProducer } = req.body

//         db.updateMany(
//             { producer: currentProducer, 'products.name': clickedProduct },
//             { $inc: { 'products.$.stock': amountToRefill } },
//             (err, result) => {
//                 if (err) console.log(err)
//                 res.send({ message: 'Lagret uppdaterat' })
//                 console.log(`${amountToRefill} added to ${clickedProduct}.`)
//             }
//         )
//     })

producer.route('/producerstock').put((req, res) => {
    const { clickedProduct } = req.body
    const amountToDecrease = parseInt(req.body.amountToDecrease)
    const { currentProducer } = req.body

    db.updateMany(
        { producer: currentProducer, 'products.name': clickedProduct },
        { $inc: { 'products.$.stock': -amountToDecrease } },
        (err, result) => {
            if (err) console.log(err)
            res.send({ message: 'Lagret uppdaterat' })
            console.log(`${amountToDecrease} removed from ${clickedProduct}.`)
        }
    )
})

module.exports = producer
