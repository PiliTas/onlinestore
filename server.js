const mysql = require('mysql');
const http = require('http');

// SE CONECTA LA BASE DE DATOS
const db = mysql.createPool({
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test'
});

// SE DEFINE ESTRUCTURA DE HTML
let page = '<html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"/><title>Tienda Online</title></head><body><header><div class="header-1"><div><h1>Bsale Test  <small> Tienda </small> </h1></div><div class="flex"><form class="flex" id="submit"><input type="text"="search" placeholder="Busca tu producto"/><button class="search-btn" type="submit"><i class="fas fa-search"></i></button></form></div></div></header><center><h1>Productos</h1></center><div id="datacontainer">{${card}}</div></body></html>';


// SE DEVUELVE LISTA CON PRODUCTOS AGRUPADOS POR CATEGORÍAS
const setResHtml = (sql, cb) => {
        db.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(sql, (err, res, fields) => {
                if (err) throw err;
                // VARIABLE PARA ALMACENAR LOS DATOS DEL QUERY
                let card = '';
                console.log(res);
                // SE GENERAN TARJETAS PARA CADA PRODUCTO
                for (let i = 0; i < res.length; i++) {
                    //Si EL PRODUCTO NO TIENE IMAGEN SE AGREGA UNA POR DEFECTO
                    console.log(res[i].url_image);
                    if (res[i].url_image === null || res[i].url_image == '') {
                        res[i].url_image = "https://www.freeiconspng.com/img/23500";
                        console.log(res[i].url_image);
                    }
                    card += `<div class="cards"> 
                <ul>
                    <li>${res[i].cate.toUpperCase()}</li> 
                    <hr>
                    <li>DESC.:${res[i].discount}%</li> 
                    <li><img src= ${res[i].url_image}></li
                      <ul>
                        <li>${res[i].name.toUpperCase()}</li>
                        <li>$${res[i].price}</li>
                     </ul>
                     
                </ul>
            </div>`
                }

                return cb(card);
            });
        });
    }
    // QUERY A LA BASE DE DATOS PARA AGRUPAR PRODUCTOS POR CATEGORÍA
let sql = 'SELECT product.id AS id, product.name AS name, product.url_image AS url_image, product.price AS price, product.discount AS discount, category.name AS cate FROM product JOIN category ON product.category = category.id ';

// SE CREA SERVIDOR PARA ACCESAR AL BROWSER
http.createServer((req, res) => {
        setResHtml(sql, resql => {
            page = page.replace('{${card}}', resql);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(page, 'utf-8');
            res.end();
        });
    })
    .listen(8080);