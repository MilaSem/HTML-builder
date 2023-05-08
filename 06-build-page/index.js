const fs = require('fs');
const path = require('path');

// подготовила папку 'project-dist'
const pathToProjectDist = path.join(__dirname, 'project-dist');

fs.rm(pathToProjectDist, {force: true, recursive: true}, (err) => {
  if (err) {
    console.log(err);
  }
  fs.mkdir(pathToProjectDist, {recursive: true}, (err) =>{
    if (err) {
      console.log(err);
    }
  });
});

// сохранила текстовое содержимое файла 'template.html' в textFromTemplate
const pathToTemplateFile = path.join(__dirname, 'template.html');
let textFromTemplateFile;

fs.readFile(pathToTemplateFile, (err, data) => {
  if (err) {
    console.log(err);
  }
  textFromTemplateFile = data.toString();
});

// создала объект, ключи которого имена файлов-компонент (articles, footer, header)
// а значение - строки разметки
// прочитала содержимое файлов-компонент и записала содержимое в объект
// далее заменила {шаблоны} из компонент на разметку
const pathToComponentsDir = path.join(__dirname, 'components');
const pathToIndexFile = path.join(pathToProjectDist, 'index.html');
let componentsObj = {};

fs.readdir(pathToComponentsDir, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach(file => {
    let partsFileName = file.name.split('.');
    if (partsFileName[1] === 'html') {
      fs.readFile(path.join(pathToComponentsDir, file.name), (err, data) => {
        if (err) {
          console.log(err);
        }
        componentsObj[partsFileName[0]] = data.toString();
  
        textFromTemplateFile = textFromTemplateFile.replace(`{{${partsFileName[0]}}}`, componentsObj[partsFileName[0]]); // '{{' так написано в файле template.html
  
        fs.writeFile(pathToIndexFile, textFromTemplateFile, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  });
});

// собрала стили как в задаче '05-merge-styles'
const pathToStylesDir = path.join(__dirname, 'styles');
const pathToStyleFile = path.join(pathToProjectDist, 'style.css');

fs.readdir(pathToStylesDir, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach(file => {
    let fileName = file.name.split('.');
    if ((file.isFile()) && (fileName[1] === 'css')) {
      fs.readFile(path.join(pathToStylesDir, file.name), (err, data) => {
        if (err) {
          console.log(err);
        }
        fs.appendFile(pathToStyleFile, data, (err) => {
          if (err) {
            console.log(err);
          }          
        });
      });
    }
  });
});

// использовала задачу '04-copy-directory'
const pathToAssetsDir = path.join(__dirname, 'assets');
const pathToCopyAssetsDir = path.join(pathToProjectDist, 'assets');

// создала папку project-dist/assets
fs.rm(pathToCopyAssetsDir, {force: true, recursive: true}, (err) => {
  if (err) {
    console.log(err);
  }
  fs.mkdir(pathToCopyAssetsDir, {recursive: true}, (err) =>{
    if (err) {
      console.log(err);
    }
  });
});

fs.readdir(pathToAssetsDir, {withFileTypes: true}, (err, items) => {
  if (err) {
    console.log(err);
  }
  items.forEach(item => {
    fs.mkdir(path.join(pathToCopyAssetsDir, item.name), {recursive: true}, (err) =>{
      if (err) {
        console.log(err);
      }
    });

    fs.readdir(path.join(pathToCopyAssetsDir, item.name), (err, files) => {
      if (err) {
        console.log(err);
      }
      files.forEach(file => {
        fs.copyFile(path.join(pathToAssetsDir, item.name, file), path.join(pathToCopyAssetsDir, item.name, file), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });
});

