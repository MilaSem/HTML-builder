const fs = require("node:fs/promises");
const path = require("path");

const { stdout, stderr } = process;

const pathToOriginDir = path.join(__dirname, "files");
const pathToCopyDir = path.join(__dirname, "files-copy");

const copyDir = async () => {
  try {
    await fs.rm(pathToCopyDir, { force: true, recursive: true });
    await fs.mkdir(pathToCopyDir, { recursive: true });

    const files = await fs.readdir(pathToOriginDir);

    await Promise.all(
      files.map((file) =>
        fs.copyFile(
          path.join(pathToOriginDir, file),
          path.join(pathToCopyDir, file)
        )
      )
    );

    stdout.write("File copying completed\n");
  } catch (err) {
    stderr.write(`Error ${err.message}\n`);
  }
};

copyDir();
