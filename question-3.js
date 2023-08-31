const fs = require("fs");
const path = require("path");
const { Stream, Readable, Writable } = require("stream");

function copyFile(source, destination, callback) {
  // Check if the source file exist
  if (!fs.existsSync(source)) {
    callback(new Error("NO such file or directory!!"));
    return;
  }

  let finalDestination = path.join(destination);

  // I split the destination and check if the length is greater than 1 for instance a file named 'data/data.json' will return an array of ['data', 'data.json],
  // if the array is length is more than 1 then, I know that is a directory and the last element in the array is the filename
  // I first pop out the last element which is the file name and store it in a variable
  // I use 'fs.mkdirSync()' to create the directory recursive with the recursive option
  // Then i use 'path.join()' to join the created directory and the filename then i store it to the finalDestination variable
  if (finalDestination.split("/").length > 1) {
    const directories = finalDestination.split("/");

    // I pop out the last element which is the file name and store it in the fileName variable so the remaining element will be the directory (since pop() modifies the array)
    const fileName = directories.pop();

    const newDirectory = path.join(...directories);

    fs.mkdirSync(newDirectory, { recursive: true });

    finalDestination = path.join(newDirectory, fileName);
  }

  const writableStream = fs.createWriteStream(path.join(finalDestination));

  const readableStream = fs.createReadStream(source).pipe(writableStream);

  readableStream.on("finish", () => console.log("File copied successfully"));

  readableStream.on("error", error => {
    callback(error);
  });
}

copyFile("text.txt", "result/data.txt", err => {
  console.log(err.message);
}); // this will log 'File copied successfully'

copyFile("result/data.txt", "folder/file.txt", err => {
  console.log(err.message); // This will log 'NO such file or directory!!'  since there is no data/text.txt
});
