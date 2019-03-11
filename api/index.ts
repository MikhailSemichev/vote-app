import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

import bodyParser from 'body-parser';
import cors from 'cors';
import nocache from 'nocache';
import errorMiddleware from './middleware/errorMiddleware';

import initTopicRouter from './routers/topics/topicsRouter';
import initVoteRouter from './routers/votes/votesWs';

const app = express();
const server = http.createServer(app);

// Middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(nocache());

const mongodb = require('./db/mongodb');
mongodb.connect();

app.use(express.static('www'));

app.get('/test', (req: express.Request, res: express.Response) => {
    res.send('Vote App Api');
});

initTopicRouter(app);

const io = socketIo();
io.attach(server);

initVoteRouter(io);

// error handling
app.use(errorMiddleware());

process.on('uncaughtException', err => {
    console.error('uncaughtException: ', err.message);
    console.error(err.stack);
    process.exit(1);
});
//

const port = process.env.PORT || 3333;
server.listen(port);
console.log(`Started in '${process.env.NODE_ENV}' mode`);
console.log(`Listening at: http://localhost:${port}`);
