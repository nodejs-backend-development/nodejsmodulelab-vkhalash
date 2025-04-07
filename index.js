const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { Transform } = require('stream');

const host = 'localhost';
const port = 8000;

class UppercaseStream extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

const server = http.createServer((req, res) => {
    const name = new URL(req.url, `http://${req.headers.host}`).searchParams.get('name');

    if (name) {
        res.writeHead(200);
        res.end(`Hello ${name}`);
        return;
    }

    if (req.url === '/upload' && req.method === 'POST') {
        const filename = req.headers['filename'];

        if (!filename) {
            res.writeHead(400);
            res.end('Missing filename header');
            return;
        }

        const sanitizedFilename = path.basename(filename);
        const uploadDir = path.join(__dirname, 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(uploadDir, sanitizedFilename);
        const writeStream = fs.createWriteStream(uploadPath);

        req.pipe(zlib.createGunzip()).pipe(writeStream);

        writeStream.on('finish', () => {
            console.log(`File ${sanitizedFilename} received and extracted.`);
            res.writeHead(200);
            res.end('File uploaded successfully');
        });

        writeStream.on('error', (error) => {
            console.error('Error saving file:', error);
            res.writeHead(500);
            res.end('Error saving file');
        });

        return;
    }

    res.writeHead(200);
    res.end();
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);

    process.stdin.pipe(new UppercaseStream()).pipe(process.stdout);
});
