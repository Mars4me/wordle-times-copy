import { memo } from "react";
const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const buttons = rows.map((row) => row.split(""));

export const Keyboard = ({ onBackspace, onPressed, letterClasses }) => {
  return (
    <div className="keyboard-wrapper">
      <div className="keyboard">
        {buttons.map((row, index) => (
          <div className={"board-row"} key={index}>
            {row.map((letter) => (
              <button className={letterClasses[letter] ?? ""} onClick={() => onPressed(letter)} key={letter}>
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="board-row">
        <button onClick={onBackspace}>Backspace</button>
      </div>
    </div>
  );
};

function keyboardPropsAreEqual(prevKeyProps, nextKeyProps) {
  return Object.keys(prevKeyProps.letterClasses).length === Object.keys(nextKeyProps.letterClasses).length;
}

export const MemoizedKeyboard = memo(Keyboard, keyboardPropsAreEqual);
