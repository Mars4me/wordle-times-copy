import { useState } from "react";
import "./App.css";
import PinInputWrapper from "./Component/PinInputWrapper";
import { getRandomWord } from "./util/dictionary";

function App() {
  const [correctWord, setCorrectWord] = useState(getRandomWord());

  const restartGameChangeCorrectWord = () => {
    setCorrectWord(getRandomWord());
  };
  console.log(correctWord);

  return (
    <div className="App">
      <PinInputWrapper rows={6} wordSize={5} correctWord={correctWord} handleRestart={restartGameChangeCorrectWord} />
      {/* <Field /> */}
    </div>
  );
}

export default App;
