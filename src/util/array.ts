import { completedWordsType } from "./../Component/PinInput/types";

export const range = (n: number) => [...Array(n).keys()];

export const filterCoincidences = (array) =>
  array.reduce((previousValue, currentValue) => {
    if (previousValue[Object.keys(currentValue)[0]]) {
      if (previousValue[Object.keys(currentValue)[0]] === "semi-correct" && Object.values(currentValue)[0] === "correct") {
        return { ...previousValue, ...currentValue };
      }
      return { ...previousValue };
    }
    return { ...previousValue, ...currentValue };
  }, {});

export const findLetterCoincidences = (array: completedWordsType[]) =>
  array
    .map((word) => {
      return word.coincidences.map((e, index) => ({ [word.text[index]]: e }));
    })
    .flat();

export const initializeCompleteWords = (rows) => Array(rows).fill({ text: "", coincidences: [] });
