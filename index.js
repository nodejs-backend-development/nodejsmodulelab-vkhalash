const http = require('http');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    // Replace this code by your own
    res.writeHead(200);
    res.end('Hello from Server!!!!');
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
