const fs = require('fs-extra');

console.log('Copy web build to: ./api/www');
fs.emptyDirSync('./api/www');
fs.copySync('./web/build', './api/www');
