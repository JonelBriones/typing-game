import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import data from "../../../data.json";
import styles from "./Game.module.scss";
// import { saveTestResult } from "../../services/api.js";
// @ts-ignore
import Cloudy from "../Cloudy/Cloudy.jsx";
const Game = () => {
  const [randomWord, setRandomWord] = useState("the fox and apple");
  const [word, setWord] = useState(randomWord);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [splitWords, setSplitWords] = useState([]);

  const [extraCharAddedIdx, setExtraCharAddedIdx] = useState(0);
  const [extraCharWord, setExtraCharWord] = useState("");
  const [extraChar, setExtraChar] = useState();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);

  const [extraInputs, setExtraInputs] = useState("");
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // const modes = ["time", "words", "quote", "cloudy"];
  const modes = ["time", "words", "cloudy"];
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
  const [timeElapsedDisplay, setTimeElapsedDisplay] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [raw, setRawWpm] = useState(0);

  type Test = {
    user: string;
    seconds: number;
    words: number;
    wpm: number;
    raw: number;
    language: string;
  };
  const user = "ijonel906";
  const language = "English";
  const [testData, setTestData] = useState<Test | null>(null);

  async function saveTest() {
    setLoading(true);
    // try {
    //   const result = await saveTestResult(testData);
    //   console.log("test saved", result);
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error saving test result", error);
    //   setLoading(false);
    // }
  }

  useEffect(() => {
    if (gameOver) {
      handleUpdateTestData();
      console.log("hjello");
      // customize cloud speed & position
      let time = () => Math.floor(Math.random() * (7 - 3 + 1)) + 3;
      let positionY = () => Math.floor(Math.random() * 100);
      const clouds = document.getElementsByClassName("cloudyImg");
      Array.from(clouds).forEach((cloud) => {
        if (cloud instanceof HTMLElement) {
          cloud?.style.setProperty("--animation-time", time() + "s");
          cloud?.style.setProperty("top", positionY() + "px");
        }
      });
    }
  }, [gameOver]);
  useEffect(() => {
    if (testData?.seconds == null) {
      return;
    } else if (testData?.seconds > 0) {
      // saveTest();
    }
    console.log(loading, timeElapsedDisplay, saveTest);
  }, [testData]);
  function handleUpdateTestData() {
    setTestData({
      user,
      seconds: timeElapsed,
      words: toggleTotalWords,
      wpm: wpm,
      raw: raw,
      language,
    });
  }

  async function fetchSentences() {
    resetTypeBoard();
    let random = () => Math.floor(Math.random() * 200);
    let selectedWords = [];
    while (selectedWords.length <= toggleTotalWords - 1) {
      selectedWords.push(data.commonWords[random()]);
    }
    // let sentences = data.sentences.filter((data) => data.total == total);
    // let sentences = data.commonWords.filter((data) => data.total == total);
    let words = selectedWords.join(" ");
    setRandomWord(words);
    setWord(words);
    setSplitWords(words.split(" "));
  }
  // async function fetchQuotes() {
  //   resetTypeBoard();
  //   let random = () => Math.floor(Math.random() * 200);
  //   // let selectedWords = [];
  //   // while (selectedWords.length <= toggleTotalWords) {
  //   //   selectedWords.push(data.commonWords[random()]);
  //   // }
  //   let quote = data.quotes[random()];
  //   // let sentences = data.commonWords.filter((data) => data.total == total);
  //   setRandomWord(quote);
  //   setWord(quote);
  // }
  useEffect(() => {
    // fetchSentences();
  }, [toggleMode, toggleTotalWords, toggleDuration]);
  function resetTypeBoard() {
    console.log("resetting board");
    setInputValue("");
    setGameOver(false);
    setDisableBackspaceIdx(0);
    setWordsTyped(0);
    setStartTime(null);
    setWpm(0);
    setRawWpm(0);
    setTimeElapsedDisplay(0);
    setStartTimer(false);
    setTimer(toggleDuration);
    setToggleTypeCursor(true);
    setGameStart(false);
    setWord(randomWord);
  }

  function handleWpmConversion() {
    let correctedLetters = 0;
    for (let i = 0; i < randomWord.length; i++) {
      if (randomWord[i] == inputValue[i]) {
        correctedLetters++;
      }
    }
    const time = (Date.now() - startTime!) / 1000;
    const wordsTyped = correctedLetters / 5;
    console.log("TIME:", time);
    const wpm = (wordsTyped * 60) / time;
    const rawWpm = ((randomWord.length / 5) * 60) / time;

    setWpm(parseFloat(wpm.toFixed(2)));
    setRawWpm(parseFloat(rawWpm.toFixed(2)));
    setTimeElapsed(parseFloat(time.toFixed(2)));
  }

  function handleOnchangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    let input = e.target.value;

    if (input.length == 1) {
      if (toggleMode == "time") {
        setStartTimer(true);
        setGameStart(true);
      }
      if (toggleMode == "words" || toggleMode == "cloudy") {
        setStartTime(Date.now());
        setGameStart(true);
      }
    }

    let inputLength = input.split("").length;
    let remainingWordChar = randomWord
      .split("")
      .slice(extraCharAddedIdx, randomWord.length)
      .join("");
    let splitInputValue = inputValue.split(" ");
    let splitvalue = input.split("");
    let lastInputChar = splitvalue[splitvalue.length - 1] == " ";
    let matchInputWordChar = randomWord[splitvalue.length - 1] == " ";
    let inputChar = splitvalue.join("");
    console.log("input length:", inputLength, input);
    console.log("extra char idx:", extraCharAddedIdx);
    // EXTRA CHARS
    // if (extraCharWord && extraCharAddedIdx == inputLength) {
    //   console.log("RESTTING,  ", input);
    //   console.log(1);
    //   setInputValue(input);
    //   setExtraCharWord("");
    // }
    if (extraCharWord && inputLength >= extraCharAddedIdx) {
      if (lastInputChar && matchInputWordChar) {
        console.log("correct space entry");
        setInputValue(input);
        setExtraCharWord("");
        setExtraCharAddedIdx(0);
      } else {
        console.log(2);
        setInputValue(input);
        setExtraCharWord(input + remainingWordChar);
      }
    }
    // if (inputLength == extraCharAddedIdx && extraCharWord) {
    //   console.log(3);
    //   setInputValue(input);
    //   setExtraCharWord(input + remainingWordChar);
    //   console.log("input length matches char", extraCharAddedIdx);
    // }

    if (extraCharWord) return;

    console.log(splitWords[0]);
    if (input.length < disableBackspaceIdx || gameOver) return;

    if (input.length == word.length) {
      setExtraInputs("");
      if (input.split("").pop() == randomWord.split("").pop()) {
        setGameOver(true);
        setStartTime(null);
        handleWpmConversion();
        setGameStart(false);
      }
    }

    if (matchInputWordChar) {
      if (lastInputChar) {
        let currentInputWord = splitInputValue[splitInputValue.length - 1];
        let currentWord = splitWords[splitInputValue.length - 1];
        // console.log(currentInputWord, currentWord);
        if (currentInputWord == currentWord) {
          console.log("words matched");
          setWordsTyped(wordsTyped + 1);
          setDisableBackspaceIdx(input.length);
        }
      } else {
        // console.log("current input char", inputChar);
        // console.log("current input length", splitvalue.length);

        // console.log("remaing word char", remainingWordChar);
        // console.log(inputChar + " " + remainingWordChar);
        // setExtraInputs();

        setExtraCharWord(inputChar + " " + remainingWordChar);
        console.log("extra char added", splitvalue.length);
        setExtraCharAddedIdx(splitvalue.length - 1);
      }
    }

    // if (input.length > word.length) {
    //   console.log("extra", input);
    //   setExtraInputs(input.slice(word.length, input.length));
    // }

    setInputValue(input);
  }

  useEffect(() => {
    if (startTime) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        setTimeElapsedDisplay(elapsedTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime]);

  useEffect(() => {
    if (startTimer) {
      let timer = toggleDuration;
      const intervalId = setInterval(() => {
        timer--;
        setTimer(timer);
        if (timer < 0 || gameOver) {
          setTimer(toggleDuration);
          setStartTimer(false);
          clearInterval(intervalId);
          setGameOver(true);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTimer]);

  useEffect(() => {
    console.log("ref true", inputRef.current);
    console.log("cursore true", toggleTypeCursor);
    if (inputRef.current) {
      console.log("setting input focus!!");
      inputRef?.current?.focus();
    }
    if (!toggleTypeCursor) {
      console.log("logging");
      window.addEventListener("keydown", () => {
        // inputRef?.current?.focus();
        setToggleTypeCursor(true);
      });
      return () => {
        window.removeEventListener("keydown", () => {});
      };
    }
  }, [inputRef, toggleTypeCursor]);

  function randomCloudGenerate() {
    return (
      <img
        id="cloudyImg"
        src="/assets/white-cloud.png"
        className={`${styles.cloudyImg} cloudyImg`}
      />
    );
  }

  return (
    <div className={`${styles.container}`}>
      {/* GAME RESULT */}

      <div
        className={`${styles.results} ${gameOver ? styles.show : styles.hide}`}
      >
        <div className={styles.cloudyImgContainer}>
          {randomCloudGenerate()}
          {randomCloudGenerate()}
          {randomCloudGenerate()}
          {randomCloudGenerate()}
        </div>

        <p>WPM:{Math.round(wpm)}</p>
        <div className={styles.resultStatsContainer}>
          <p>
            <span>test type</span>
            <span>
              words {toggleTotalWords} {language.toLocaleLowerCase()}
            </span>
          </p>
          <p>
            <span>raw</span>
            <span>{Math.round(raw)}</span>
          </p>
          <p>
            <span>characters</span>
            <span>{`${randomWord.length}/0/0/0`}</span>
          </p>
          <p>
            <span>consistency</span>
            <span>#%</span>
          </p>
          <p>
            <span>time</span>
            <span>{Math.round(timeElapsed)}s</span>
          </p>
        </div>
        <div className={styles.resultBtnContainer}>
          <button
            className={styles.resetBtn}
            type="button"
            tabIndex={0}
            onClick={() => {
              fetchSentences();
              resetTypeBoard();
            }}
          >
            next
          </button>
          <button
            className={styles.resetBtn}
            type="button"
            tabIndex={0}
            onClick={resetTypeBoard}
          >
            <MdRefresh size={"1.5rem"} />
          </button>
        </div>
      </div>

      <div className={` ${!gameOver ? styles.show : styles.hide}`}>
        {gameStart && toggleMode == "cloudy" && (
          <div className={styles.cloudy}>
            <Cloudy
              setGameOver={setGameOver}
              setStartTime={setStartTime}
              handleWpmConversion={handleWpmConversion}
              setGameStart={setGameStart}
            />
          </div>
        )}
        {/* MODES */}
        <div className={styles.modesContainer}>
          <div className={`${styles.modes}`}>
            <div className={styles.mode}>
              {modes.map((mode) => (
                <button
                  className={`${styles.optionBtn} ${
                    toggleMode == mode && styles.toggle
                  }`}
                  key={mode}
                  onClick={() => {
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
                      setToggleDuration(duration);
                    }}
                  >
                    {duration}
                  </button>
                ))}

              {(toggleMode == "words" || toggleMode == "cloudy") && (
                <>
                  {totalWords.map((total) => (
                    <button
                      className={`${styles.optionBtn} ${
                        total == toggleTotalWords && styles.toggle
                      }`}
                      key={total}
                      onClick={() => {
                        setToggleTotalWords(total);
                      }}
                    >
                      {total}
                    </button>
                  ))}
                </>
              )}
              {toggleMode == "quote" &&
                quotes.map((quote) => (
                  <button
                    className={`${styles.optionBtn} ${
                      quote == toggleMode && styles.toggle
                    }`}
                    key={quote}
                    onClick={() => {}}
                  >
                    {quote}
                  </button>
                ))}
            </div>
          </div>
        </div>
        {/* GAME CONTAINER */}
        <div className={`${styles.game}`}>
          <div className={styles.typingContainer}>
            <div className={`${styles.timer}`}>
              {startTimer && toggleMode == "time" && <span>{timer}</span>}
              {startTime && toggleMode == "words" && toggleTypeCursor && (
                <span>
                  {wordsTyped}/{toggleTotalWords}
                </span>
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
            <div
              className={`${styles.words} ${!toggleTypeCursor && styles.blur}`}
            >
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
                  setToggleTypeCursor(false);
                }}
                className={`${styles.typeInput}`}
                onKeyDown={(e) => {
                  if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
                    e.preventDefault();
                  }
                }}
              />

              {extraCharWord
                ? extraCharWord.split("").map((letter, idx) =>
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
                  )
                : word.split("").map((letter, idx) =>
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
          </div>
        </div>
      </div>

      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
