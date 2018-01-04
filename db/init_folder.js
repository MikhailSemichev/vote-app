const fs = require('fs');
const mkdirp = require('mkdirp');

const MONGO_DB_PATH = getMongoDBPath();

// Create directory for MongoDB database data
if (!fs.existsSync(MONGO_DB_PATH)) {
    mkdirp.sync(MONGO_DB_PATH);
}

///

function getMongoDBPath() {
    const config = fs.readFileSync('./mongod.conf').toString();
    const matches = config.match(/dbPath: (.*)/);
    return matches && matches[1];
}
