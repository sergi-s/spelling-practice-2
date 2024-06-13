// eslint-disable-next-line @typescript-eslint/no-var-requires
const { tokenizeCorpus } = require("../app/utils/NLP/tokenizeCorpus.cjs");
const {
  createFrequencyDocument,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("../app/utils/NLP/createFrequencyDocument.cjs");

void tokenizeCorpus().then((d) => {
  return createFrequencyDocument(d);
});
