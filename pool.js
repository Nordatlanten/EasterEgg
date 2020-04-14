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

let getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection)
    })
}

module.exports = getConnection
