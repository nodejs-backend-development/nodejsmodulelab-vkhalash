const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function sendFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: '/upload',
        method: 'POST',
        headers: {
            filename: path.basename(filePath),
        },
    };

    const req = http.request(options, (res) => {
        res.on('data', (chunk) => {
            console.log('Response received:', chunk.toString());
        });
    });

    fileStream.pipe(zlib.createGzip()).pipe(req);
}

sendFile('./test.txt');
