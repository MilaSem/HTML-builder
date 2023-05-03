const fs = require('fs');
const path = require('path');

const fileLocation = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(fileLocation);

stream.on('data', function(chunk) {
  console.log(chunk.toString());
});