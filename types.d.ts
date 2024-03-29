// Define the structure of your data based on the provided JSON
type WordData = {
  WORD: string;
  MEANINGS: Meaning[];
  ANTONYMS: string[];
  SYNONYMS: string[];
};

type Meaning = {
  partsOfSpeech: string;
  definition: string;
  relatedWords: string[];
  exampleSentence: string[];
};

// Error type remains the same
type DictError = {
  err: string;
};
