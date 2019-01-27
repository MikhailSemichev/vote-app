const mongoose = require('mongoose');

const dbuser = 'vote-app';
const dbpassword = 'vote-app-1';

const connectionString = process.env.CONNECTION_STR ||
    `mongodb://${dbuser}:${dbpassword}@ds211088.mlab.com:11088/vote-app-dev`;

module.exports = {
    connect
};

function connect() {
    return mongoose.connect(connectionString, {
        useNewUrlParser: true
    });
}
