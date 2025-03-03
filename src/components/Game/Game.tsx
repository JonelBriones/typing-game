import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import data from "../../../data.json";
import styles from "./Game.module.scss";
console.log(data);
const Game = ({ toggleDarkMode }: any) => {
  const [randomWord, setRandomWord] = useState(
    "the apple fox blew the horse away"
  );
  const [word, setWord] = useState(randomWord);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [extraInputs, setExtraInputs] = useState("");
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const wrapper = document.getElementById("wrapper");
  const isDark = wrapper?.classList[1] == "dark";

  const modes = ["time", "words", "quote"];
  const quotes = ["short", "medium", "long"];
  const durations = [15, 30, 60, 120];
  const totalWords = [10, 25, 50, 100];
  const [toggleMode, setToggleMode] = useState("words");
  const [toggleDuration, setToggleDuration] = useState(15);
  const [timer, setTimer] = useState(toggleDuration);
  const [toggleTotalWords, setToggleTotalWords] = useState(10);
  const [startTimer, setStartTimer] = useState(false);

  // SCORE TRACKING
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);

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
    setWordsTyped(0);
  }

  function handleOnchangeInput(e) {
    let input = e.target.value;

    if (input.length == 1 && toggleMode == "time") {
      setStartTimer(true);
    }

    if (input.length == 1 && toggleMode == "words") {
      setStartTime(Date.now());
    }

    if (input.length < disableBackspaceIdx || gameOver) return;

    if (input.length == word.length) {
      setExtraInputs("");
      if (input.split("").pop() == randomWord.split("").pop()) {
        setGameOver(true);
        setStartTime(null);
      }
    }

    if (input.length > word.length) {
      console.log("extra", input);
      setExtraInputs(input.slice(word.length, input.length));
    }

    let arr = input.split("");

    let isPrevValSpace = randomWord[arr.length - 1] == " ";

    if (isPrevValSpace && input.length > 0) {
      if (word.slice(0, inputValue.length) == inputValue) {
        console.log("word 1: ", word.slice(0, inputValue.length));
        console.log("word 2: ", inputValue);
        setWordsTyped(wordsTyped + 1);
        setDisableBackspaceIdx(input.length);
      }
    }

    setInputValue(input);
  }

  useEffect(() => {
    console.log("starting?", startTime);
    if (startTime) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        console.log("time: ", elapsedTime);
        setTimeElapsed(elapsedTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime]);

  useEffect(() => {
    if (timeElapsed > 0) {
      const wordsPerMinute = (wordsTyped / (timeElapsed / 60)).toFixed(2);
      setWpm(parseFloat(wordsPerMinute));
    }
  }, [wordsTyped, timeElapsed]);

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
    console.log("change", inputRef.current);
    if (inputRef.current) {
      inputRef?.current.focus();
    }
  }, [inputRef, inputRef?.current]);

  function handleBlur() {}

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className={`${styles.container}`}>
      {/* MODES */}
      <div className={`${styles.modes}`}>
        <div className={styles.mode}>
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
        </div>
        <div className={styles.optionBreaker} />
        <div className={styles.optionSettings}>
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
          {toggleMode == "quote" &&
            quotes.map((quote) => (
              <button
                className={`${styles.optionBtn} ${
                  quote == toggleMode && styles.toggle
                }`}
                key={quote}
                onClick={() => {
                  resetTypeBoard();
                }}
              >
                {quote}
              </button>
            ))}
        </div>
      </div>

      {/* GAME CONTAINER */}

      <div className={`${styles.game}`}>
        {/* GAME RESULT */}
        {gameOver && (
          <div>
            <p>Success</p>
            <p>WPM:{wpm}</p>
          </div>
        )}

        <div className={`${styles.timer}`}>
          {startTimer && toggleMode == "time" && <span>Time: {timer}</span>}
          {startTime && toggleMode == "words" && (
            <span>Time: {timeElapsed}</span>
          )}
        </div>

        {!toggleTypeCursor && (
          <div
            className={styles.gameFocus}
            onClick={() => inputRef?.current?.focus()}
          >
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
            onBlur={async () => {
              await sleep(1200);
              setToggleTypeCursor(false);
            }}
            className={`${styles.typeInput} ${
              toggleTypeCursor && styles.focus
            }`}
          />
        </div>
        <button
          className={styles.resetBtn}
          type="button"
          tabIndex={0}
          onClick={resetTypeBoard}
        >
          <MdRefresh size={"1.5rem"} />
        </button>
      </div>
      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
