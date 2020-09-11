const http = require('http');

http.createServer((req, res) => {
    res.write('Hola mundo')
}).listen(8080, () => {
    console.log('Listening port:', 8080);
});