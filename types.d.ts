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

// SQLite database types
type DatabaseSchema = {
  words: WordData;
  users: User;
  submitted_definitions: SubmittedDefinition;
};

type User = {
  id: number;
  email: string;
  otp: string;
};

type SubmittedDefinition = {
  id: number;
  word_id: number;
  user_id: number;
  definition: string;
  approved: boolean;
};
