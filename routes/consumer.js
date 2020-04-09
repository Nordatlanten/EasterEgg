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
    .route('/consumer/:userid')

    .get((req, res) => {
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
                    res.render('./consumer.ejs', { c: results, d: egg, e: userid })
                })
            })
        })
    })


consumer.route('/addedCandy/:userid')

    .post((req, res) => {
        let eggName = req.body.name
        let candyList = req.body.candyList
        let userid = req.params.userid


        let query = `INSERT INTO addedCandy (eggName, name, amount, price, userid) VALUES (?, ?, ?, ?, ?)`
        pool((err, connection) => {
            async.forEachOf(candyList, function(candy, i, inner_callback) {

                try {

                    let values = [eggName, candy.name, candy.amount, candy.price, userid]
                    console.log(values)

                    connection.query(query, values, (err, result, fields) => {

                        if (err) throw err
                     
                        console.log(eggName + 'added')
                    })
                } catch (error) {
                    return callback(error)
                }


            })
            connection.release()
        })


    })


module.exports = consumer



// app.post('/', (req, res) => {
//     database.run('INSERT INTO testquiz (quizname) VALUES (?)', [req.body.quizname]).then(statement => {
//         const promises = []
//         const id = statement.lastID
//         for (let n = 0; n < req.body.questions.length; n++) {
//             const promise = database.run(
//                 'INSERT INTO testquestions (question, a1, a2, a3, a4, group_id, rightanswer) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                 [
//                     req.body.questions[n].question,
//                     req.body.questions[n].a1,
//                     req.body.questions[n].a2,
//                     req.body.questions[n].a3,
//                     req.body.questions[n].a4,
//                     id,
//                     req.body.questions[n].rightanswer,
//                 ]
//             )
//             promises.push(promise)
//         }
//         Promise.all(promises).then(() => {
//             res.send('Quiz added')
//         })
//     })
// })
