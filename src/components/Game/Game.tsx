import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import data from "../../../data.json";
import styles from "./Game.module.scss";
// import { saveTestResult } from "../../services/api.js";
// @ts-ignore
import Cloudy from "../Cloudy/Cloudy.jsx";
import Board from "./Board.js";
const Game = () => {
  const [randomWord, setRandomWord] = useState("the fox and apple");
  const [word, setWord] = useState(randomWord);
  const [splitWords, setSplitWords] = useState(randomWord.split(" "));

  const [extraCharAddedIdx, setExtraCharAddedIdx] = useState<number>(0);
  const [inputContainsExtraChar, setInputContainsExtraChar] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [extraCharWord, setExtraCharWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [extraInputs, setExtraInputs] = useState("");
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);

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
    setWord(randomWord);
    setStartGame(false);
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

    if (extraCharAddedIdx) {
      console.log("current input is:", input);
      let inputLength = input.split("").length;
      let remainingWordChar = randomWord
        .split("")
        .slice(extraCharAddedIdx, randomWord.length)
        .join("");

      console.log("input length:", inputLength, input);
      console.log("extra char idx:", extraCharAddedIdx);
      console.log(splitWords);

      if (inputLength > extraCharAddedIdx) {
        let splitvalue = input.split("");
        let inputLength = splitvalue.length;
        let currentWord = randomWord
          .split("")
          .slice(0, extraCharAddedIdx)
          .join("");
        let extraChar = splitvalue
          .slice(extraCharAddedIdx, inputLength - 1)
          .join("");
        setExtraCharWord(currentWord + extraChar + remainingWordChar);
      }
      if (inputLength <= extraCharAddedIdx) {
        setInputValue(input);
        setExtraCharWord("");
        setExtraCharAddedIdx(0);
      }
    }

    if (input.length < disableBackspaceIdx || gameOver) return;

    if (input.length == word.length) {
      setExtraInputs("");
      if (input.split("").pop() == randomWord.split("").pop()) {
        setGameOver(true);
        setStartTime(null);
        handleWpmConversion();
        setStartGame(false);
      }
    }

    let splitInputValue = inputValue.split(" ");

    let splitvalue = input.split("");
    let inputLength = splitvalue.length;

    let lastInputCharIsSpace = splitvalue[inputLength - 1] == " ";
    let wordAtInputIsSpace = randomWord[inputLength - 1] == " ";

    console.log("is valid space?", wordAtInputIsSpace);

    // is current letter valid?

    let currentInputWord = splitInputValue[splitInputValue.length - 1];
    let currentWord = splitWords[splitInputValue.length - 1];

    if (wordAtInputIsSpace && lastInputCharIsSpace) {
      console.log("char is a valid space");
      if (currentInputWord == currentWord) {
        console.log("words matched");
        setWordsTyped(wordsTyped + 1);
        setDisableBackspaceIdx(input.length);
      }
    }
    if (wordAtInputIsSpace && !lastInputCharIsSpace) {
      console.log("char needed to be a space");
      if (currentInputWord == currentWord) {
        console.log("words matched");
        setWordsTyped(wordsTyped + 1);
        setDisableBackspaceIdx(input.length);
      }
      // an extra letter was added on required space

      // setting contains extra char value as true
      setInputContainsExtraChar(true);

      // return the words with extra char

      // should only set once
      if (!extraCharAddedIdx) {
        console.log("formating word with extra char");

        const remainingChar = splitWords
          .slice(wordsTyped + 1, splitWords.length)
          .join(" ");

        setExtraCharAddedIdx(inputLength - 1);
        console.log(currentWord + currentInputWord + " " + remainingChar);
        //  grab the extra char
        console.log(inputLength);
        console.log(
          currentWord + splitvalue[inputLength - 1] + " " + remainingChar
        );
        setExtraCharWord(
          currentWord + splitvalue[inputLength - 1] + " " + remainingChar
        );
      }
    }

    setInputValue(input);
  }

  function randomCloudGenerate() {
    return (
      <img
        id="cloudyImg"
        src="/assets/white-cloud.png"
        className={`${styles.cloudyImg} cloudyImg`}
      />
    );
  }
  useEffect(() => {
    console.log(startGame);
  }, [startGame]);
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
        {startGame && toggleMode == "cloudy" && (
          <div className={styles.cloudy}>
            <Cloudy
              setGameOver={setGameOver}
              setStartTime={setStartTime}
              handleWpmConversion={handleWpmConversion}
              setStartGame={setStartGame}
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
              {startGame && toggleMode == "time" && <span>{timer}</span>}
              {startGame && toggleMode == "words" && toggleTypeCursor && (
                <span>
                  {wordCount}/{toggleTotalWords}
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
              <Board
                startTime={startTime}
                startTimer={startTimer}
                timer={timer}
                toggleTypeCursor={toggleTypeCursor}
                wordsTyped={wordsTyped}
                inputRef={inputRef}
                setToggleTypeCursor={setToggleTypeCursor}
                toggleTotalWords={toggleTotalWords}
                extraCharAddedIdx={extraCharAddedIdx}
                extraCharWord={extraCharWord}
                word={word}
                extraInputs={extraInputs}
                resetTypeBoard={resetTypeBoard}
                setStartTimer={setStartTimer}
                setStartTime={setStartTime}
                toggleMode={toggleMode}
                toggleDuration={toggleDuration}
                gameOver={gameOver}
                setGameOver={setGameOver}
                wordCount={wordCount}
                setWordCount={setWordCount}
                setStartGame={setStartGame}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
