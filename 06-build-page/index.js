const fs = require("node:fs/promises");
const path = require("node:path");

const pathToProjectDist = path.join(__dirname, "project-dist");
const pathToTemplateFile = path.join(__dirname, "template.html");
const pathToComponentsDir = path.join(__dirname, "components");
const pathToIndexFile = path.join(pathToProjectDist, "index.html");
const pathToStylesDir = path.join(__dirname, "styles");
const pathToStyleFile = path.join(pathToProjectDist, "style.css");
const pathToAssetsDir = path.join(__dirname, "assets");
const pathToCopyAssetsDir = path.join(pathToProjectDist, "assets");

// функция для создания папки assets и вложенных папок (вызывается рекурсивно)
const copyAssets = async (srcPath, destPath) => {
  await fs.rm(destPath, { force: true, recursive: true });
  await fs.mkdir(destPath, { recursive: true });
  const assets = await fs.readdir(srcPath, { withFileTypes: true });

  await Promise.all(
    assets.map((asset) => handleAsset(asset, srcPath, destPath))
  );
};

// функция обработки каждого ассета (файла или папки)
const handleAsset = async (asset, srcPath, destPath) => {
  const srcAssetPath = path.join(srcPath, asset.name);
  const destAssetPath = path.join(destPath, asset.name);

  if (asset.isDirectory()) {
    await copyAssets(srcAssetPath, destAssetPath);
  } else {
    await fs.copyFile(srcAssetPath, destAssetPath);
  }
};

// функция фильтрации файлов по расширению и последующего чтения содержимого
const readFilesWithExt = async (dir, ext) => {
  const files = await fs.readdir(dir, { withFileTypes: true });
  return Promise.all(
    files
      .filter((file) => file.isFile() && path.extname(file.name) === ext)
      .map((file) => readFileContent(dir, file, ext))
  );
};

// функция возвращает объект с именем и содержимым файла
const readFileContent = async (dir, file, ext) => {
  const content = await fs.readFile(path.join(dir, file.name), {
    encoding: "utf8",
  });
  return { name: path.basename(file.name, ext), content };
};

const buildProject = async () => {
  try {
    // создаю папку для проекта
    await fs.rm(pathToProjectDist, { force: true, recursive: true });
    await fs.mkdir(pathToProjectDist, { recursive: true });

    // заменяю шаблоны в html на соответствующие компоненты
    let textFromTemplateFile = await fs.readFile(pathToTemplateFile, {
      encoding: "utf8",
    });
    const components = await readFilesWithExt(pathToComponentsDir, ".html");
    components.forEach((component) => {
      textFromTemplateFile = textFromTemplateFile.replaceAll(
        `{{${component.name}}}`,
        component.content
      );
    });
    // пишу компоненты в файл index.html
    await fs.writeFile(pathToIndexFile, textFromTemplateFile);

    // объединяю стили
    const styles = await readFilesWithExt(pathToStylesDir, ".css");
    await fs.writeFile(
      pathToStyleFile,
      styles.map((style) => style.content).join("\n")
    );

    // копирую папку assets и вложенные папки
    await copyAssets(pathToAssetsDir, pathToCopyAssetsDir);
  } catch (err) {
    process.stderr.write(`Error ${err.message}\n`);
  }
};

buildProject();
