import dictionary from "../data/wordle-eng.json";

type isProperFunc = (word: string) => boolean;

export const isProper: isProperFunc = (word) => dictionary.includes(word);

export const getRandomWord = () => dictionary[Math.floor(Math.random() * dictionary.length)];
