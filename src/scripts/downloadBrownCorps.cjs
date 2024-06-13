const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

// Define the URL of the zip file
const ZIP_URL = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/brown.zip";

// Define the folder name
const FOLDER_NAME = "brown";

// Get the absolute path of the current directory
const CURRENT_DIR = process.cwd();

// Define the absolute path for extraction in the public directory
const PUBLIC_DIR = `./public/corps`;
const EXTRACTION_PATH = `${PUBLIC_DIR}/${FOLDER_NAME}`;

// Create the public directory if it doesn't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Remove any existing folder with the same name
if (fs.existsSync(EXTRACTION_PATH)) {
  fs.rmdirSync(EXTRACTION_PATH, { recursive: true });
}

// Download the zip file using https.get
https.get(ZIP_URL, (res) => {
  if (res.statusCode === 200) {
    const fileStream = fs.createWriteStream(`${PUBLIC_DIR}/${FOLDER_NAME}.zip`);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      // Extract the contents of the zip file to the specified directory
      exec(`unzip "${PUBLIC_DIR}/${FOLDER_NAME}.zip" -d "${PUBLIC_DIR}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error: ${stderr}`);
          return;
        }
        console.log(`Extraction successful. Files are located in the directory: ${EXTRACTION_PATH}`);
        fs.writeFileSync(`${EXTRACTION_PATH}/.gitkeep`, 'corps');
        // Clean up: Remove the downloaded zip file
        fs.unlinkSync(`${PUBLIC_DIR}/${FOLDER_NAME}.zip`);
      });
    });
  } else {
    console.error("Error: Download failed. Please check the URL and try again.");
  }
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
