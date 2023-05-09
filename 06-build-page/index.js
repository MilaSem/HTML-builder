const fsPromises = require('fs/promises');
const path = require('path');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToTemplateFile = path.join(__dirname, 'template.html');
const pathToComponentsDir = path.join(__dirname, 'components');
const pathToIndexFile = path.join(pathToProjectDist, 'index.html');
const pathToStylesDir = path.join(__dirname, 'styles');
const pathToStyleFile = path.join(pathToProjectDist, 'style.css');
const pathToAssetsDir = path.join(__dirname, 'assets');
const pathToCopyAssetsDir = path.join(pathToProjectDist, 'assets');

// функция для создания папки assets и вложенных папок (вызывается рекурсивно)
async function copyAssets(srcPath, destPath) {
  await fsPromises.rm(destPath, {force: true, recursive: true});
  await fsPromises.mkdir(destPath, {recursive: true});
  const assets = await fsPromises.readdir(srcPath, {withFileTypes: true});
  for (const asset of assets) {
    if (asset.isDirectory()) {
      await copyAssets(path.join(srcPath, asset.name), path.join(destPath, asset.name));
    } else {
      await fsPromises.copyFile(path.join(srcPath, asset.name), path.join(destPath, asset.name));
    }
  }
}

async function main() {
  try {
    // создаю папку для проекта
    await fsPromises.rm(pathToProjectDist, {force: true, recursive: true});
    await fsPromises.mkdir(pathToProjectDist, {recursive: true});
    // в объекте храню компоненты ('название тега': 'разметка')
    // заменяю шаблоны в html на соответствующие компоненты
    let textFromTemplateFile = await fsPromises.readFile(pathToTemplateFile, {encoding: 'utf8'});
    const componentsObj = {};
    const files = await fsPromises.readdir(pathToComponentsDir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const partsFileName = file.name.split('.');
        if (partsFileName[1] === 'html') {
          componentsObj[partsFileName[0]] = await fsPromises.readFile(path.join(pathToComponentsDir, file.name), {encoding: 'utf8'});
          textFromTemplateFile = textFromTemplateFile.replace(`{{${partsFileName[0]}}}`, componentsObj[partsFileName[0]]);
        }
      }
    }
    // пишу компоненты в файл index.html
    await fsPromises.writeFile(pathToIndexFile, textFromTemplateFile);
    // объединяю стили
    const styles = await fsPromises.readdir(pathToStylesDir, {withFileTypes: true});
    for (const style of styles) {
      if (style.isFile()) {
        const styleFileName = style.name.split('.');
        if (styleFileName[1] === 'css') {
          const styleComponent = await fsPromises.readFile(path.join(pathToStylesDir, style.name), {encoding: 'utf8'});
          await fsPromises.appendFile(pathToStyleFile, styleComponent);
        }
      }
    }
    // копирую папку assets и вложенные папки
    await copyAssets(pathToAssetsDir, pathToCopyAssetsDir);

  } catch(err) {
    console.error(err.message);
  }
}

main();