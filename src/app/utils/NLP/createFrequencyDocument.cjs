// eslint-disable-next-line @typescript-eslint/no-var-requires
const { existsSync, readFileSync, writeFileSync } = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WordTokenizer } = require("natural");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**
 * @param {string[]} documents
 * @returns {Record<string,number>}
 */
function createFrequencyDocument(documents) {
  console.log("I WILL SAVE TO FILE");
  const outputFilePath = path.join(
    process.cwd(),
    "public/frequency",
    "frequencyDocument.json",
  );

  // // Check if the JSON file exists
  // if (existsSync(outputFilePath)) {
  //   // Load and parse the existing JSON file
  //   const fileContent = readFileSync(outputFilePath, "utf8");
  //   /**@type {Record<string,number>} */
  //   const data = JSON.parse(fileContent);
  //   return data;
  // }

  // Calculate word frequency if the file doesn't exist
  /**@type {Record<string,number>} */
  const wordFrequency = {};
  const tokenizer = new WordTokenizer();

  // Add documents to the frequency model
  documents.forEach((doc) => {
    const words = tokenizer.tokenize(doc.toLowerCase());
    words.forEach((word) => {
      if (wordFrequency[word]) {
        wordFrequency[word]++;
      } else {
        wordFrequency[word] = 1;
      }
    });
  });

  // Write the JSON string to a file
  writeFileSync(outputFilePath, JSON.stringify(wordFrequency), "utf8");
  return wordFrequency;
}

module.exports = { createFrequencyDocument };
