const fs = require("fs");
const path = require("path");

const fileLocation = path.join(__dirname, "text.txt");

const stream = fs.createReadStream(fileLocation, { encoding: "utf8" });

stream.on("data", (chunk) => process.stdout.write(chunk));
