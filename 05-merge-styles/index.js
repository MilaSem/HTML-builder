const fs = require('fs');
const path = require('path');

const dirStyleLocation = path.join(__dirname, 'styles');
const fileStyleLocation = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(dirStyleLocation, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach(file => {
    let fileName = file.name.split('.');
    if ((file.isFile()) && (fileName[1] === 'css')) {
      fs.readFile(path.join(dirStyleLocation, file.name), (err, data) => {
        if (err) {
          console.log(err);
        }
        fs.appendFile(fileStyleLocation, data, (err) => {
          if (err) {
            console.log(err);
          }          
        });
      });
    }
  });
});