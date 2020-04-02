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



consumer
    .route('/consumer')
    .get((req, res) => {
        db.find().toArray((err, results) => {
            if (err) console.log(err)
           
            res.render('./consumer.ejs', { p: results })
        })
    })




module.exports = consumer
