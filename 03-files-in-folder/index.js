const fs = require("node:fs/promises");
const path = require("path");

const { stdout, stderr } = process;

const dirLocation = path.join(__dirname, "secret-folder");

const getFileInfo = async () => {
  try {
    const files = await fs.readdir(dirLocation, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        await processFile(file);
      }
    }
  } catch (err) {
    stderr.write(`Error ${err.message}\n`);
  }
};

const processFile = async (file) => {
  const filePath = path.join(dirLocation, file.name);
  const stats = await fs.stat(filePath);
  const fileExtension = path.extname(file.name).slice(1);
  const fileName = path.basename(file.name, `.${fileExtension}`);

  const output = `${fileName} - ${fileExtension} - ${stats.size}b\n`;

  stdout.write(output);
};

getFileInfo();
