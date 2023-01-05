import { useState } from "react";
import "./App.css";
import Game from "./Component/Game";
import { getRandomWord } from "./util/dictionary";
import { ROWS, WORD_LENGTH } from "./util/gameConst";

function App() {
  const [correctWord, setCorrectWord] = useState<string>(getRandomWord());

  const changeCorrectWord = () => {
    setCorrectWord(getRandomWord());
  };
  console.log(correctWord);

  return (
    <div className="App">
      <Game rows={ROWS} wordSize={WORD_LENGTH} correctWord={correctWord} handleRestart={changeCorrectWord} />
    </div>
  );
}

export default App;
