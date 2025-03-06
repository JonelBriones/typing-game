import React, { useState, useEffect, Fragment, useRef } from "react";
import styles from "./Game.module.scss";
import { MdRefresh } from "react-icons/md";
const TypingGame = ({
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
}: any) => {
  const [input, setInput] = useState("");
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState<number | null>(
    null
  );
  const [lastKey, setLastKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [time, setTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number | null>(null);
  useEffect(() => {});
  const onHandleInputChange = (e) => {
    let input = e.target.value;

    if (input.length == 1) {
      setToggleTypeCursor(true);
      setStartGame(true);
      if (toggleMode == "words") {
        // countUp(Date.now());
      }
      if (toggleMode == "time") {
        // countDown();
      }
    }
    if (input.length < disableBackspaceIdx) return;

    // if space is valid
    let inputCharArr = input.split("");
    let currentInput = inputCharArr[inputCharArr.length - 1];
    let matchCharInWord = word[inputCharArr.length - 1];
    if (currentInput == matchCharInWord && currentInput !== " ") {
      console.log("correct letter");
    } else if (matchCharInWord == " ") {
      console.log("char needs to be a space");

      if (inputCharArr[inputCharArr.length - 1] == " ") {
        let inputWordArr = input.split(" ");

        // was the previous word correct?

        // if word count was increment on wrong word find the difference of inputArr.length & wordCount
        // verify if last word matches
        let currentWord = input.split(" ")[wordCount];
        let isWordMatch = word.split(" ")[wordCount];

        if (currentWord == isWordMatch) {
          console.log("correct word");
          setDisableBackspaceIdx(input.length);
          console.log(
            "is a space?",
            input.split("")[input.split("").length - 1] == " "
          );
          if (input.split("")[input.split("").length - 1] == " ") {
            setWordCount(wordCount + 1);
          }
        }
      }
    } else {
      let inputChar = input.split("");
      if (inputChar[inputChar.length - 1] == " ") {
        console.log("space was press");
      } else {
        console.log("another letter was pressed");
      }
    }

    setInput(input);
  };
  const onHandleKeyDown = (e) => {
    setLastKey(e.key);
  };

  const renderText = () => {
    console.log("logging");
    let displayText = "";
    let correctedInput;

    for (let i = 0; i < input.length; i++) {
      if (word[i] === input[i]) {
        console.log("valid letter");
      } else if (word[i] == " ") {
        console.log("value requires a space");
      } else {
        console.log("wrong letter");
      }
    }

    return correctedInput;
  };
  function countUp(time: number) {
    console.log("Game mode:", toggleMode);
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - time) / 1000);
      console.log("count up", elapsedTime);
      setTimeElapsed(elapsedTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
    if (!toggleTypeCursor) {
      window.addEventListener("keydown", () => {
        // inputRef?.current?.focus();
        setToggleTypeCursor(true);
      });
      return () => {
        window.removeEventListener("keydown", () => {});
      };
    }
  }, [inputRef, toggleTypeCursor]);

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
        onKeyDownCapture={(e) => onHandleKeyDown(e)}
        onFocus={() => setToggleTypeCursor(true)}
        onBlur={async () => {
          setToggleTypeCursor(false);
        }}
        className={`${styles.typeInput}`}
        onKeyDown={(e) => {
          if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
            e.preventDefault();
          }
          setLastKey(e.key);
        }}
      />

      {extraCharWord
        ? extraCharWord.split("").map((letter, idx) =>
            letter == " " ? (
              <span
                key={idx}
                className={` ${styles.space} ${styles.letter} ${
                  input[idx] == undefined
                    ? ""
                    : letter == input[idx]
                    ? styles.valid
                    : styles.error
                } ${toggleTypeCursor && idx == input.length && styles.cursor} `}
              >
                {letter}
              </span>
            ) : (
              <span
                key={idx}
                className={` ${styles.letter} ${
                  input[idx] == undefined
                    ? ""
                    : idx >= extraCharAddedIdx - 1
                    ? styles.error
                    : styles.valid
                } ${toggleTypeCursor && idx == input.length && styles.cursor} `}
              >
                {letter}
              </span>
            )
          )
        : word.split("").map((letter, idx) =>
            letter == " " ? (
              <span
                key={idx}
                className={` ${styles.space} ${styles.letter} ${
                  input[idx] == undefined
                    ? ""
                    : letter == input[idx]
                    ? styles.valid
                    : styles.error
                } ${toggleTypeCursor && idx == input.length && styles.cursor} `}
              >
                {letter}
              </span>
            ) : (
              <span
                key={idx}
                className={` ${styles.letter} ${
                  input[idx] == undefined
                    ? ""
                    : letter == input[idx]
                    ? styles.valid
                    : styles.error
                } ${toggleTypeCursor && idx == input.length && styles.cursor} `}
              >
                {letter}
              </span>
            )
          )}
      {extraInputs &&
        extraInputs.split("").map((letter, idx) => (
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

export default TypingGame;
