const { access } = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const dirStyleLocation = path.join(__dirname, 'styles');
const fileStyleLocation = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    await fsPromises.writeFile(fileStyleLocation, '');
    const styles = await fsPromises.readdir(dirStyleLocation, {withFileTypes: true});
    for (const style of styles) {
      if (style.isFile()) {
        const styleFileName = style.name.split('.');
        if (styleFileName[1] === 'css') {
          const styleComponent = await fsPromises.readFile(path.join(dirStyleLocation, style.name), {encoding: 'utf8'});
          await fsPromises.appendFile(fileStyleLocation, styleComponent);
        }
      }
    }
  } catch(err) {
    console.error(err.message);
  }
}

mergeStyles();