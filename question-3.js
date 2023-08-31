const fs = require("fs");
const path = require("path");
const { Readable, Writable, Transform, pipeline } = require("stream");
const { promisify } = require("util");

// Define the source and destination directories for the backup
const sourceDir = "text.txt";
const destDir = "/path/to/destination";

// Promisify pipeline to handle async copying
const pipelineAsync = promisify(pipeline);

// Recursive function to copy files and directories
async function copyRecursive(source, destination) {
  try {
    // Ensure the destination directory exists; create it if not
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const items = await fs.promises.readdir(source);

    for (const item of items) {
      const sourceItemPath = path.join(source, item);
      const destItemPath = path.join(destination, item);
      const stat = await fs.promises.stat(sourceItemPath);

      if (stat.isDirectory()) {
        await copyRecursive(sourceItemPath, destItemPath); // Recursively copy directories
      } else {
        // Create readable and writable streams
        const sourceStream = fs.createReadStream(sourceItemPath);
        const destStream = fs.createWriteStream(destItemPath);

        // Use pipeline to efficiently copy data
        await pipelineAsync(sourceStream, destStream);
      }
    }

    console.log(`Copied ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying ${source} to ${destination}: ${err.message}`);
  }
}

// Start the backup process
copyRecursive(sourceDir, destDir);
