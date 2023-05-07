const fs = require('fs');
const path = require('path');

const pathToOriginDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.rm(pathToCopyDir, {force: true, recursive: true}, (err) => {
    if (err) {
      console.log(err);
    }
    fs.mkdir(pathToCopyDir, {recursive: true}, (err) =>{
      if (err) {
        console.log(err);
      }
      fs.readdir(pathToOriginDir, (err, files) => {
        if (err) {
          console.log(err);
        }
        files.forEach(file => {
          fs.copyFile(path.join(pathToOriginDir, file), path.join(pathToCopyDir, file), (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      })
    });
  });
}

copyDir();
console.log('Копирование файлов завершено');

