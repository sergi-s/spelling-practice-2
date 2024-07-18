// eslint-disable-next-line @typescript-eslint/no-var-requires
const { writeFileSync } = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WordTokenizer } = require("natural");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**
 * @param {string[]} documents
 * @returns {Record<string,number>}
 */
function createFrequencyDocument(documents) {
  const outputFilePath = path.join(
    process.cwd(),
    "public/frequency",
    "frequencyDocument.json",
  );

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

/**
 * @param {string[]} documents
 */
function createInvertedFrequencyDocument(documents) {
  // Use the provided function to create the frequency document
  const frequencyDocument = createFrequencyDocument(documents);

  const invertedFrequencyScores = getInvertedFrequencyScores(frequencyDocument);

  // Optionally, save the inverted frequency scores to a file
  const outputFilePath = path.join(
    process.cwd(),
    "public/frequency",
    "invertedFrequencyDocument.json",
  );
  writeFileSync(
    outputFilePath,
    JSON.stringify(invertedFrequencyScores),
    "utf8",
  );

  return invertedFrequencyScores;
}

/**
 * @param { Record<string, number>} frequencyDocument
 * @returns { Record<string, number>}
 */
function getInvertedFrequencyScores(frequencyDocument) {
  // Calculate the inverted frequency scores
  /** @type {Record<string, number>} */
  const invertedFrequencyScores = {};
  for (const [word, freq] of Object.entries(frequencyDocument)) {
    invertedFrequencyScores[word] = 1 / freq;
  }
  return invertedFrequencyScores;
}

module.exports = {
  createFrequencyDocument,
  invertedFrequencyScores: getInvertedFrequencyScores,
  createInvertedFrequencyDocument,
};
