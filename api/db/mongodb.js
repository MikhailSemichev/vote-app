const mongoose = require('mongoose');

const dbuser = 'vote-app';
const dbpassword = 'vote-app-1';

module.exports = {
    connect
};

function connect() {
    return mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds239137.mlab.com:39137/vote-app`);
}
