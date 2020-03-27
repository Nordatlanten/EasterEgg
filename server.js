const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const ObjectId = require('mongodb').ObjectID

const { MongoClient } = require('mongodb')

const pw = require('./pw.js')

const uri = pw.mdbConnect
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const pool = require('./pool.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

let db

client.connect(err => {
    if (err) console.log(err)
    db = client.db('candydb').collection('candy')
})

app.get('/', (req, res) => {
    db.find().toArray((err, results) => {
        if (err) console.log(err)
        res.render('./index.ejs', { candy: results })
    })
})

app.post('/candy', (req, res) => {
    db.insertOne(req.body, (err, result) => {
        if (err) console.log(err)
        console.log(`${req.body.candy} added.`)
    })
    res.redirect('/')
})

app.delete('/del', (req, res) => {
    const { id } = req.body
    db.deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(500, err)
        res.send({ message: 'Godis bortplockad' })
    })
})

app.get('/sqltest', (req, res) => {
    let query = `SELECT * FROM Producers`

    pool((err, connection) => {
        connection.query(query, (err, result, fields) => {
            connection.release()

            if (err) throw err

            res.send(result)
        })
    })
})

app.listen(8081, () => {
    console.log('Lyssnar på 8081')
})
