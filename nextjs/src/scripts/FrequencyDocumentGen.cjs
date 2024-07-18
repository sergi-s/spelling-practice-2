// eslint-disable-next-line @typescript-eslint/no-var-requires
const { tokenizeCorpus } = require("../app/utils/NLP/tokenizeCorpus.cjs");
const {
  createFrequencyDocument,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("../app/utils/NLP/createFrequencyDocument.cjs");

// !Stop using the Frequency as a difficulty metric for now
// void tokenizeCorpus().then((d) => {
//   if (!d) return;
//   return createFrequencyDocument(d);
// });
