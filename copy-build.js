const fs = require('fs-extra');

fs.emptyDirSync('./api/www');
fs.copySync('./web/build', './api/www');

console.log('Copied web build to: ./api/www');
