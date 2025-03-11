import { useEffect, Fragment, useState } from "react";
import styles from "./Board.module.scss";
import { MdRefresh } from "react-icons/md";
import Words from "./words/Words";
const Board = ({
  toggleTypeCursor,
  setToggleTypeCursor,
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
  timeElapsed,
  afk,
  setAfk,
}: any) => {
  // const [lastKey, setLastKey] = useState<string | null>(null);
  // const [wordCharTracker, setWordCharTrack] = useState([]);
  // const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState<string | null>(null);

  const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toggleTypeCursor) return;
    setAfk(false);
    let input = e.target.value;
    if (input.length == 1) {
      setToggleTypeCursor(true);
      setStartGame(true);
      if (toggleMode == "words" || "cloudy") {
        setTime(Date.now());
      }
      if (toggleMode == "time") {
        setTime(toggleDuration);
      }

      console.log(lastKeyDown);
    }
    if (input.length < disableBackspaceIdx) return;

    for (let i = 0; i < word.length - 1; i++) {}

    // if space is valid
    let inputCharArr = input.split("");
    let currentInput = inputCharArr[inputCharArr.length - 1];
    let matchCharInWord = word[inputCharArr.length - 1];
    if (currentInput == matchCharInWord && currentInput !== " ") {
      // console.log("correct letter");
    } else if (matchCharInWord == " ") {
      // console.log("char needs to be a space");

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

    setKeydownTime(timeElapsed);
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

  const [keydownTime, setKeydownTime] = useState(0);
  useEffect(() => {
    if (startGame && toggleMode == "words") {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - time) / 1000);
        setTimeElapsed(elapsedTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startGame]);

  useEffect(() => {
    console.log(`last key down:${keydownTime}, current time:${timeElapsed}`);
    if (timeElapsed - keydownTime >= 5) {
      console.log("afk");
      // setAfk(true);
      // resetTypeBoard();
    }
  }, [timeElapsed]);

  useEffect(() => {
    if (startGame && toggleMode == "time") {
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
  }, [startGame]);

  return (
    <div className={styles.typingContainer}>
      <input
        autoComplete="off"
        spellCheck="false"
        id="gameTypeInput"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => onHandleInputChange(e)}
        onFocus={() => setToggleTypeCursor(true)}
        onBlur={async () => {
          setToggleTypeCursor(false);
        }}
        className={`${styles.typeInput}`}
        onKeyDown={(e) => {
          if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
            e.preventDefault();
          }
          setLastKeyDown(e.key);
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
    </div>
  );
};

export default Board;
