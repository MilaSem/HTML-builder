const fs = require("fs");
const path = require("path");

const { stdin, stdout } = process;

const fileLocation = path.join(__dirname, "text.txt");

const stream = fs.createWriteStream(fileLocation);

stdout.write(
  "All text from the command line will be saved in text.txt\nTo terminate the app type 'exit'\nEnter your text:\n"
);

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    toCloseApp();
  }
  stream.write(data);
});

const toCloseApp = () => {
  stdout.write("\nThe text is recorded. Bye!");
  process.exit();
};

process.on("SIGINT", toCloseApp);
