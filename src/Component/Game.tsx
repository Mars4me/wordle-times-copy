import React, { FC, useEffect, useMemo, useState } from "react";
import { MemoizedKeyboard } from "./Keyboard";
import { MemoPinInput } from "./PinInput/PinInput";
import { isProper } from "../util/dictionary";
import { completedWordsType } from "./PinInput/types";
import { filterCoincidences, initializeCompleteWords } from "../util/array";
import { findLetterCoincidences } from "../util/array";

interface GameProps {
  rows: number;
  wordSize: number;
  correctWord: string;
  handleRestart: () => void;
}

const Game: FC<GameProps> = ({ rows, wordSize, correctWord, handleRestart }) => {
  const [currentWord, setCurrentWord] = useState<string[]>([] as Array<string>);
  const [completedWords, setCompletedWords] = useState<completedWordsType[]>(initializeCompleteWords(rows));
  const [won, setWon] = useState<boolean>(false);

  const handleBackspace = () => setCurrentWord((prev) => prev.slice(0, prev.length - 1));

  const handlePressed = (letter) => {
    setCurrentWord((prev) => {
      if (prev.length >= wordSize) {
        return prev;
      }
      return [...prev, letter.toLowerCase()];
    });
  };

  const restart = () => {
    setCurrentWord([]);
    setWon(false);
    setCompletedWords(initializeCompleteWords(rows));

    handleRestart();
  };

  const checkWord = () => {
    const parseToStringWord = currentWord.join("");
    if (parseToStringWord === correctWord) {
      setWon(true);
    }
    if (isProper(parseToStringWord)) {
      if (completedWords.find((e) => e.text === parseToStringWord)) {
        return false;
      }

      const coincidences = findCoincidences();

      setCompletedWords((prev) =>
        prev.map((el, idx) => (idx === currentGuessWordIndex ? { text: parseToStringWord, coincidences } : el))
      );
      setCurrentWord([]);
    }
  };

  const getCurrentGuessWordIndex = () => {
    return completedWords.findIndex((obj) => obj.text === "");
  };

  const currentGuessWordIndex = useMemo(() => {
    return getCurrentGuessWordIndex();
  }, [completedWords]);

  const findCoincidences = () => {
    const coincidences = currentWord.map((letter, index) => {
      if (letter === correctWord[index]) {
        return "correct";
      } else if (correctWord.includes(letter)) {
        return "semi-correct";
      } else {
        return "incorrect";
      }
    });

    return coincidences;
  };

  useEffect(() => {
    const onKeydown = (e) => {
      e.target.blur();
      e.preventDefault();
      if (e.key === "Backspace") {
        handleBackspace();
      }

      if (e.key === "Enter") {
        checkWord();
      }

      if (e.keyCode >= 65 && e.keyCode <= 90 && currentWord.length < 5) {
        const letter = String.fromCharCode(e.keyCode);
        handlePressed(letter);
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [currentWord]);

  const letterClasses = useMemo(() => {
    const checkLetterCoincidences = findLetterCoincidences(completedWords);
    const filteredCoincidences = filterCoincidences(checkLetterCoincidences);
    return filteredCoincidences;
  }, [completedWords]);

  if (won) {
    return (
      <div className="restart">
        <h1>
          Ви відгадали <b>{correctWord}</b>
        </h1>
        <button onClick={restart} className="restart-button">
          Почати нову гру
        </button>
      </div>
    );
  }

  return (
    <div>
      {completedWords.map((word, index) => (
        <MemoPinInput
          key={index}
          cells={wordSize}
          text={currentGuessWordIndex === index ? currentWord.join("") : word.text}
          highlight={completedWords[index].coincidences}
        />
      ))}
      <MemoizedKeyboard letterClasses={letterClasses} onPressed={handlePressed} onBackspace={handleBackspace} />
    </div>
  );
};

export default Game;
