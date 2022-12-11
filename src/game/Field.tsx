import { MemoizedKeyboard } from "./Keyboard";
import { useEffect, useMemo, useState } from "react";
import { range } from "../util/array";
import { getRandomWord, isProper } from "../util/dictionary";

const WORD_LENGTH = 5;
const ROWS = 6;

type CellState = {
  letter: string;
  variant?: "correct" | "semi-correct" | "incorrect";
};

type Board = CellState[][];

const deepCopyBoard = (board: Board): Board => JSON.parse(JSON.stringify(board));

const getPrevCell = (board: Board): CellState | undefined => {
  const flatArray = board.flat();
  if (flatArray[flatArray.length - 1].letter) {
    return flatArray[flatArray.length - 1];
  }
  const nextEmptyIndex = flatArray.findIndex((el) => el.letter === "");

  return nextEmptyIndex > 0 ? flatArray[nextEmptyIndex - 1] : undefined;
};

const getEmptyCell = () => ({
  letter: "",
});

const getEmptyBoard = () => range(ROWS).map(() => range(WORD_LENGTH).map(getEmptyCell));

const getCurrentRow = (board) => {
  const prevCell = getPrevCell(board);
  return board.find((row) => (prevCell ? row.includes(prevCell) : undefined));
};

export const Field = () => {
  const [board, setBoard] = useState<Board>(getEmptyBoard());

  const [correctWord, setCorrectWord] = useState(getRandomWord());
  const [peremoha, setPeremoha] = useState(false);
  const [completedWordCount, setCompletedWordCount] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  const [blockedInput, setBlockedInput] = useState(false);

  const currentWord = useMemo(() => {
    const prevCell = getPrevCell(board);
    return board
      .find((row) => (prevCell ? row.includes(prevCell) : undefined))
      ?.map((cell) => cell.letter)
      .join("");
  }, [board]);

  console.log(correctWord);

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Backspace") {
        handleBackspace();
      }
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        handlePressed(e.key);
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [blockedInput, currentWord]);

  useEffect(() => {
    if (currentWord && currentWord.length === WORD_LENGTH) {
      console.log(currentWord, "hasfhashfahsfhasfhashf");
      if (currentWord === correctWord) {
        setPeremoha(true);
      } else if (isProper(currentWord)) {
        setCompletedWords((prev) => [...prev, currentWord]);
        setCompletedWordCount((e) => e + 1);
        setBoard((prev) => {
          const nextBoard = deepCopyBoard(prev);
          getCurrentRow(nextBoard).forEach((cell: CellState, index) => {
            if (cell.letter === correctWord[index]) {
              cell.variant = "correct";
            } else if (correctWord.includes(cell.letter)) {
              cell.variant = "semi-correct";
            } else {
              cell.variant = "incorrect";
            }
          });
          return nextBoard;
        });
      } else {
        setBlockedInput(true);
      }
    } else {
      setBlockedInput(false);
    }
  }, [currentWord]);

  const handleRestart = () => {
    if (peremoha) {
      setCorrectWord(getRandomWord());
      setBoard(getEmptyBoard());
      setPeremoha(false);
      setCompletedWordCount(0);
      setCompletedWords([]);
    }
  };

  const handleBackspace = () => {
    if (currentWord && currentWord.length === WORD_LENGTH && !blockedInput) {
      return;
    }
    setBoard((prev) => {
      const nextBoard = deepCopyBoard(prev);
      const prevCell = getPrevCell(nextBoard);
      if (prevCell) {
        prevCell.letter = "";
      }
      return nextBoard;
    });
  };

  const handlePressed = (letter) => {
    if (blockedInput) {
      return;
    }
    setBoard((prev) => {
      const nextState = deepCopyBoard(prev);

      const nextEmptyCell = nextState.flat().find((el) => el.letter === "");
      if (nextEmptyCell) {
        nextEmptyCell.letter = letter.toLowerCase();
      }
      return nextState;
    });
  };

  const letterClasses = useMemo(() => {
    return board.flat().reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue.letter]: currentValue.variant,
      }),
      {}
    );
  }, [completedWordCount]);

  if (peremoha) {
    return (
      <div className="restart">
        <h1>
          Ви відгадали <b>{correctWord}</b>
        </h1>
        <button onClick={handleRestart} className="restart-button">
          Почати нову гру
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, index) => (
              <div className={`cell ${cell.variant}`} key={index}>
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <MemoizedKeyboard letterClasses={letterClasses} onPressed={handlePressed} onBackspace={handleBackspace} />
    </>
  );
};
