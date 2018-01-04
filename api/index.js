const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Middleware

const bodyParser = require('body-parser');
const cors = require('cors');
const nocache = require('nocache');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(nocache());


const mongodb = require('./db/mongodb');
mongodb.connect();


app.get('/', (req, res) => {
    res.send('Vote App Api');
});

require('./routers/topics/topicsRouter')(app);
// app.use('/api', require('./routers/topics/votesRouter'));

// require('./restApi')(app);
require('./routers/votes/votesWs')(app);
app.io.attach(server);

//
const port = process.env.PORT || 3333;
server.listen(port);
console.log('Listening at: http://localhost:' + port);
