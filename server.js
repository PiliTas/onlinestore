const http = require('http');
const mysql = require('mysql');
// SE CONECTA LA BASE DE DATOS
const db = mysql.createConnection({
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test'
});

db.connect((error) => {
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connnected');
    }
});

let sql = 'SELECT * FROM product';
db.query(sql, (error, res, fields) => {
    if (error) throw error;
    db.end();
    console.log(res);
});



http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // Se escribirá una página web
        res.write('Hola mundo'); //Se escribe en el browser
        res.end(); // Se termina de crear respuesta
    })
    .listen(8080, () => {
        console.log('Listening port:', 8080);
    });