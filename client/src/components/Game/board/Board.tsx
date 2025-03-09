import { useEffect, Fragment, useState } from "react";
import styles from "./Board.module.scss";
import { MdRefresh } from "react-icons/md";
import Words from "./Words";
const Board = ({
  toggleTypeCursor,
  setToggleTypeCursor,
  extraCharAddedIdx,
  extraCharWord,
  word,
  extraInputs,
  resetTypeBoard,
  gameOver,
  toggleMode,
  toggleDuration,
  setGameOver,
  wordCount,
  setWordCount,
  setStartGame,
  input,
  setInput,
  setTimeElapsed,
  startGame,
  time,
  setTime,
  inputRef,
  disableBackspaceIdx,
  setDisableBackspaceIdx,
  board,
}: any) => {
  // const [lastKey, setLastKey] = useState<string | null>(null);
  const [wordCharTracker, setWordCharTrack] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toggleTypeCursor) return;
    let input = e.target.value;
    setCursorPosition(input.length);
    if (input.length == 1) {
      setToggleTypeCursor(true);
      setStartGame(true);
      if (toggleMode == "words" || "cloudy") {
        setTime(Date.now());
      }
      if (toggleMode == "time") {
        countDown();
      }
    }
    if (input.length < disableBackspaceIdx) return;

    for (let i = 0; i < word.length - 1; i++) {}

    // if space is valid
    let inputCharArr = input.split("");
    let currentInput = inputCharArr[inputCharArr.length - 1];
    let matchCharInWord = word[inputCharArr.length - 1];
    if (currentInput == matchCharInWord && currentInput !== " ") {
      console.log("correct letter");
    } else if (matchCharInWord == " ") {
      console.log("char needs to be a space");

      if (inputCharArr[inputCharArr.length - 1] == " ") {
        // space in correct position

        let currentWord = input.split(" ")[wordCount];
        let isWordMatch = word.split(" ")[wordCount];

        if (currentWord == isWordMatch) {
          console.log("correct word");
          setDisableBackspaceIdx(input.length);
          console.log(
            "is a space?",
            input.split("")[input.split("").length - 1] == " "
          );
          setWordCount(wordCount + 1);
          // if (input.split("")[input.split("").length - 1] == " ") {
          //   setWordCount(wordCount + 1);
          // }
        }
      }
    }

    setInput(input);
    if (
      input.split("")[input.split("").length - 1] ==
        word.split("")[word.split("").length - 1] &&
      input.length == word.length
    ) {
      setGameOver(true);
      setStartGame(false);
      setDisableBackspaceIdx(null);
    }
  };

  useEffect(() => {
    console.log("Game mode:", toggleMode);
    if (startGame) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - time) / 1000);
        // console.log("count up", elapsedTime);
        setTimeElapsed(elapsedTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startGame]);

  function countDown() {
    console.log("Game mode:", toggleMode);
    let timer = toggleDuration;
    const intervalId = setInterval(() => {
      timer--;
      setTime(timer);
      console.log("count down", timer);
      if (timer < 0 || gameOver) {
        clearInterval(intervalId);
        setGameOver(true);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }

  return (
    <>
      <input
        autoComplete="off"
        spellCheck="false"
        id="gameTypeInput"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => onHandleInputChange(e)}
        // onKeyDownCapture={(e) => onHandleKeyDown(e)}
        onFocus={() => setToggleTypeCursor(true)}
        onBlur={async () => {
          setToggleTypeCursor(false);
        }}
        className={`${styles.typeInput}`}
        onKeyDown={(e) => {
          if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
            e.preventDefault();
          }
          // setLastKey(e.key);
        }}
      />

      <Words
        board={board}
        styles={styles}
        input={input}
        toggleTypeCursor={toggleTypeCursor}
        word={word}
      />

      {extraInputs &&
        extraInputs.split("").map((letter: string, idx: number) => (
          <Fragment key={idx}>
            <span className={styles.error}>
              {toggleTypeCursor && idx == input.length && (
                <span className={styles.cursor} />
              )}
              {letter}
            </span>
          </Fragment>
        ))}
      <div className={styles.resetBtnContainer}>
        <button
          className={styles.resetBtn}
          type="button"
          tabIndex={0}
          onClick={resetTypeBoard}
        >
          <MdRefresh size={"1.5rem"} />
        </button>
      </div>
    </>
  );
};

export default Board;
