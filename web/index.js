const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Middleware

const bodyParser = require('body-parser');
const cors = require('cors');

app.wrap = fn => (...args) => fn(...args).catch(args[2]);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get('/test', (req, res) => {
    res.send('Vote App Web');
});

process.on('uncaughtException', err => {
    console.error('uncaughtException: ', err.message);
    console.error(err.stack);
    process.exit(1);
});
//

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Started in '${process.env.NODE_ENV}' mode`);
console.log(`Listening at: http://localhost:${port}`);
