const mysql = require('mysql')
const pw = require('./pw.js')

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'remotemysql.com',
    port: '3306',
    user: pw.user,
    password: pw.password,
    database: 'Cv8kmkezK3',
})


// const config = {
//     host: 'remotemysql.com',
//     port: '3306',
//     user: pw.user,
//     password: pw.password,
//     database: 'Cv8kmkezK3',
// })

// class Database {
//     constructor(config) {
//         this.connection = mysql.createConnection(config)
//     }
//     query(sql, args) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, args, (err, rows) => {
//                 if (err) 
//                     return reject(err)
//                 resolve(rows)
//             })
//         })
//     }
//     close(){
//         return new Promise((resolve, reject) => {
//             this.connection.end(err => {
//                 if (err)
//                     return reject(err)
//                 resolve()
//             })
//         })
//     }
// }



let getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection)
    })
}

module.exports = getConnection
// module.exports = Database


