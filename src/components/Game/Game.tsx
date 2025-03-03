import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import data from "../../../data.json";
import styles from "./Game.module.scss";
console.log(data);
const Game = ({ toggleDarkMode }: any) => {
  const [randomWord, setRandomWord] = useState(
    "the apple fox blew the horse away"
  );
  const test =
    "pettifoggings deathcup diagraph shakedown trappers interrogatees consistently housemate emboss uglified";
  const [word, setWord] = useState(randomWord);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [completedWord, setCompletedWord] = useState(0);
  const [extraInputs, setExtraInputs] = useState("");
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const wrapper = document.getElementById("wrapper");
  const isDark = wrapper?.classList[1] == "dark";

  const modes = ["time", "words", "quote"];
  const durations = [15, 30, 60];
  const totalWords = [10, 25, 50, 100];
  const [toggleMode, setToggleMode] = useState("words");
  const [toggleDuration, setToggleDuration] = useState(15);
  const [timer, setTimer] = useState(toggleDuration);
  const [toggleTotalWords, setToggleTotalWords] = useState(10);
  const [startTimer, setStartTimer] = useState(false);
  async function fetchSentences(total?: number, duration?: number) {
    let max = total == 50 ? 5 : 10;
    let random = Math.floor(Math.random() * max);
    console.log("total", total);
    let sentences = data.sentences.filter((data) => data.total == total);
    let randomSentence = sentences[random];

    setRandomWord(randomSentence.sentence);
    setWord(randomSentence.sentence);
  }
  function resetTypeBoard() {
    setInputValue("");
    setGameOver(false);
    setDisableBackspaceIdx(0);
    setCompletedWord(0);
  }

  function handleOnchangeInput(e) {
    let input = e.target.value;

    if (input.length == 1 && toggleMode == "time") {
      setStartTimer(true);
    }

    if (input.length < disableBackspaceIdx || gameOver) return;

    if (input.length == word.length) {
      setExtraInputs("");
      if (input.split("").pop() == randomWord.split("").pop()) {
        setGameOver(true);
      }
    }

    if (input.length > word.length) {
      console.log("extra", input);
      setExtraInputs(input.slice(word.length, input.length));
    }

    let arr = input.split("");

    let isPrevValSpace = randomWord[arr.length - 1] == " ";

    if (isPrevValSpace && input.length > 0) {
      // console.log(
      //   "previous value is space ",
      //   isPrevValSpace && input.length > 0
      // );
      if (word.slice(0, inputValue.length) == inputValue) {
        console.log("word 1: ", word.slice(0, inputValue.length));
        console.log("word 2: ", inputValue);
        setCompletedWord(completedWord + 1);
        setDisableBackspaceIdx(input.length);
      }
    }

    setInputValue(input);
  }

  useEffect(() => {
    if (startTimer) {
      let timer = toggleDuration;
      const intervalId = setInterval(() => {
        timer--;
        console.log("counter: ", timer);
        setTimer(timer);
        if (timer < 0) {
          setTimer(toggleDuration);
          setStartTimer(false);
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }, [startTimer]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current.focus();
    }
  }, [inputRef, inputRef?.current]);

  return (
    <div className={`${styles.container}`} onClick={inputRef?.current?.focus()}>
      <div className={`${styles.modes}`}>
        {modes.map((mode) => (
          <button
            className={`${styles.optionBtn} ${
              toggleMode == mode && styles.toggle
            }`}
            key={mode}
            onClick={() => {
              resetTypeBoard();
              fetchSentences(toggleTotalWords);
              setToggleMode(mode);
            }}
          >
            {mode}
          </button>
        ))}
        {toggleMode == "time" &&
          durations.map((duration) => (
            <button
              className={`${styles.optionBtn} ${
                duration == toggleDuration && styles.toggle
              }`}
              key={duration}
              onClick={() => {
                resetTypeBoard();
                fetchSentences(undefined, duration);
                setToggleDuration(duration);
              }}
            >
              {duration}
            </button>
          ))}
        {toggleMode == "words" &&
          totalWords.map((total) => (
            <button
              className={`${styles.optionBtn} ${
                total == toggleTotalWords && styles.toggle
              }`}
              key={total}
              onClick={() => {
                resetTypeBoard();
                fetchSentences(total, undefined);
                setToggleTotalWords(total);
              }}
            >
              {total}
            </button>
          ))}
      </div>

      {/* GAME CONTAINER */}

      <div className={`${styles.game}`}>
        {gameOver && <p>Success</p>}

        <div className={`${styles.timer}`}>
          {startTimer && toggleMode == "time" && timer}
        </div>

        {!toggleTypeCursor && (
          <div className={styles.gameFocus}>
            <p>click here or press any key to focus</p>
          </div>
        )}
        <div className={styles.typingContainer}>
          <div
            className={`${styles.words} ${!toggleTypeCursor && styles.blur}`}
          >
            {word.split("").map((letter, idx) =>
              letter == " " ? (
                <span
                  key={idx}
                  className={` ${styles.space} ${styles.letter} ${
                    inputValue[idx] == undefined
                      ? ""
                      : letter == inputValue[idx]
                      ? styles.valid
                      : styles.error
                  } ${
                    toggleTypeCursor &&
                    idx == inputValue.length &&
                    styles.cursor
                  } `}
                >
                  {letter}
                </span>
              ) : (
                <span
                  key={idx}
                  className={` ${styles.letter} ${
                    inputValue[idx] == undefined
                      ? ""
                      : letter == inputValue[idx]
                      ? styles.valid
                      : styles.error
                  } ${
                    toggleTypeCursor &&
                    idx == inputValue.length &&
                    styles.cursor
                  } `}
                >
                  {letter}
                </span>
              )
            )}
            {extraInputs &&
              extraInputs.split("").map((letter, idx) => (
                <Fragment key={idx}>
                  <span className={styles.error}>
                    {toggleTypeCursor && idx == inputValue.length && (
                      <span className={styles.cursor} />
                    )}
                    {letter}
                  </span>
                </Fragment>
              ))}
          </div>
          <input
            autoComplete="off"
            spellCheck="false"
            id="gameTypeInput"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleOnchangeInput(e)}
            onFocus={() => setToggleTypeCursor(true)}
            // onBlur={() => setToggleTypeCursor(false)}
          />

          <button className={`${styles.resetBtn}`}>
            <MdRefresh size={"1.5rem"} onClick={resetTypeBoard} />
          </button>
        </div>
      </div>
      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
