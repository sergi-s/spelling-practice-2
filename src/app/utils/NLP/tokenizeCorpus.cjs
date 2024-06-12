// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WordTokenizer } = require("natural");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// Use process.cwd() to get the absolute path to the current working directory
const corpusDirectory = path.join(process.cwd(), "public/corps/brown");

// Create a tokenizer instance
const tokenizer = new WordTokenizer();

/**
 * @param {string | any[]} word
 */
function isPosTag(word) {
  // POS tags typically consist of 2-4 lowercase letters
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return /^[a-z]{2,4}$/.test(word);
}

// Function to check if a word contains English characters only
/**
 * @param {string | any[]} word
 */
function isEnglishWord(word) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return /^[a-zA-Z]+$/.test(word) && !isPosTag(word) && word.length > 1;
}

// Function to parse the Brown Corpus files and return the extracted data
async function tokenizeCorpus() {
  /**
   * @type {string[]}
   */
  const result = [];

  try {
    // Read the list of files in the corpus directory
    const files = await fs.promises.readdir(corpusDirectory);

    // Process each file in the corpus
    for (const file of files) {
      const data = await fs.promises.readFile(
        `${corpusDirectory}/${file}`,
        "utf8",
      );

      // Split the data into lines
      const lines = data.split("\n");

      // Process each line
      for (const line of lines) {
        // Tokenize the line using the natural tokenizer
        const tokens = tokenizer.tokenize(line);

        // Filter out non-English words
        const englishTokens = tokens.filter((token) => isEnglishWord(token));

        // Extract relevant information from the tokens
        const words = englishTokens.map((token) => token.toLowerCase()); // Convert to lowercase

        // Add the extracted words to the result
        result.push(...words);
      }
    }

    return result;
  } catch (error) {
    console.error("Error tokenizing corpus:", error);
    throw error;
  }
}
module.exports = { tokenizeCorpus };
