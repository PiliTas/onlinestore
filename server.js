const mysql = require('mysql');
const http = require('http');

const port = process.env.PORT || 3000;

// SE CONECTA LA BASE DE DATOS
const db = mysql.createPool({
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test'
});

// SE DEFINE ESTRUCTURA DE HTML CON SU ESTILO
let page = '<html><style>*{box-sizing: border-box;}body, html {background:#f2f3fe; margin:0;padding:0;font-size:1em;font-family:"Calibri",sans-serif;}header {border: none;width: 100%;height: 100px; background-color: #DF3A01; color: white;}ul{list-style-type: none;padding: 1px;padding-top: 1px;}h1 {margin:0px auto 8px auto;}.header-1 {height: 100%;display: flex;justify-content: space-between;align-items: center;padding-left: 10px;padding-right: 10px;}.flex {display: flex;}input,button{border: 1px solid #dedede;border-top-left-radius: 4px; border-bottom-left-radius: 4px;font-size: 14px;padding: 8px 10px;  margin: 0;}input[type=\'text\']{width: 200px;}.search-btn {width:36px; higth:2000px;cursor: pointer;border-left: 0;border-radius: 0;border-top-right-radius: 4px;  border-bottom-right-radius: 4px;}#datacontainer {margin-top: 10px;display: inline-flex;justify-content: space-around;flex-wrap: wrap;}.cards {width:300px;heigth: 300px;margin-top:10px;font-size: 90%;color: black;padding-top: 19px;padding-left: 19px;padding-right: 19px;border: none; border-radius:8px;  background-color:#FFFFFF;}.cards img {width: 260px; height: 250px; padding: 0;}</style><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"/><title>Tienda Online</title></head><body><header><div class="header-1"><div><h1>Bsale Test  <small> Tienda </small> </h1></div><div class="flex"><form class="flex" id="submit"><input type="text"="search" placeholder="Busca tu producto"/><button class="search-btn" type="submit"><i class="fas fa-search"></i></button></form></div></div></header><center><h1>Productos</h1></center><div id="datacontainer">{${card}}</div></body></html>';


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
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // SE ESTA ESCRIBIENDO UN ARCHIVO HTML
            res.write(page, 'utf-8'); // SE RENDERIZA PÁGINA CON ESTILOS DEFINIDOS
            res.end(); //SE TERMINA DE CREAR RESPUESTA
        });
    })
    .listen(port, () => {
        console.log(`Escuchando peticiones en el puerto ${ port }`);

    });