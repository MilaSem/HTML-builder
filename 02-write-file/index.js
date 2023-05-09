const fs = require('fs');
const path = require('path');

const fileLocation = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(fileLocation);

process.stdout.write('Весь текст из командной строки будет сохранён в text.txt\nДля выхода введи exit\nНапиши свой текст:\n');

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    toCloseApp();
  }
  stream.write(data);
});

process.on('SIGINT', () => {
  toCloseApp();
});

const toCloseApp = function() {
  process.stdout.write('Текст записан. Пока!');
  process.exit();
}