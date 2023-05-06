const fs = require('fs');
const path = require('path');

const dirLocation = path.join(__dirname, 'secret-folder');

fs.readdir(dirLocation, {withFileTypes: true}, toGiveOutInfo);

function toGiveOutInfo(err, files) {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        let fileName = file.name.split('.'); // так показалось проще, чем path.extname
        fs.stat(path.join(dirLocation, file.name), (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(fileName[0] + ' - ' + fileName[1] + ' - ' + stats.size + 'b');
          }
        });
      }
    });
  }
}
