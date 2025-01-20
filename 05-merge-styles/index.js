const fs = require("node:fs/promises");
const path = require("node:path");
const { EOL } = require("node:os");

const dirStyleLocation = path.join(__dirname, "styles");
const fileStyleLocation = path.join(__dirname, "project-dist", "bundle.css");

const mergeStyles = async () => {
  try {
    await fs.writeFile(fileStyleLocation, "");

    const styles = await fs.readdir(dirStyleLocation, { withFileTypes: true });

    const stylePromises = styles
      .filter((style) => style.isFile() && path.extname(style.name) === ".css")
      .map((style) =>
        fs.readFile(path.join(dirStyleLocation, style.name), {
          encoding: "utf8",
        })
      );

    const styleComponents = await Promise.all(stylePromises);

    await fs.appendFile(fileStyleLocation, styleComponents.join(EOL));
  } catch (err) {
    process.stderr.write(`Error ${err.message}\n`);
  }
};

mergeStyles();
