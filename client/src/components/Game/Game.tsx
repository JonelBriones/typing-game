import { useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";
import data from "../../../data.json";
import styles from "./Game.module.scss";
import { IoIosInfinite } from "react-icons/io";

// import { saveTestResult } from "../../services/api.js";
// @ts-ignore
import Cloudy from "./Cloudy/Cloudy.js";
import Board from "./board/Board.js";
const Game = () => {
  const [randomWord, setRandomWord] = useState("the fox and apple");
  const [word, setWord] = useState(randomWord);

  const [board, setBoard] = useState<any>([]);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);

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
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState<number | null>(
    18 // null
  );
  // SCORE TRACKING
  const [input, setInput] = useState("");

  const [time, setTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [raw, setRawWpm] = useState(0);
  const [correctletter, setCorrectLetter] = useState(0);

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
      console.log("game over");
      handleWpmConversion();
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
  }, [testData]);
  function handleWpmConversion() {
    let correctedLetters = 0;
    for (let i = 0; i < randomWord.length; i++) {
      if (randomWord[i] == input[i]) {
        correctedLetters++;
      }
    }
    const timer = (Date.now() - time!) / 1000;
    const wordsTyped = correctedLetters / 5;
    const wpm = (wordsTyped * 60) / timer;
    const raw = ((randomWord.length / 5) * 60) / timer;
    console.log(wpm);
    console.log(raw);
    setCorrectLetter(correctedLetters);
    setWpm(parseFloat(wpm.toFixed(2)));
    setRawWpm(parseFloat(raw.toFixed(2)));
    setTimeElapsed(parseFloat(timer.toFixed(2)));
    setTestData({
      user,
      seconds: timeElapsed!,
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
    createBoard(words.split(" "));
  }
  function createBoard(words: string[]) {
    let board = [];
    for (let i = 0; i < words.length; i++) {
      let currentWord = words[i];
      let charIdx = [];
      for (let j = 0; j < currentWord.length; j++) {
        charIdx.push(currentWord[j]);
      }
      if (i !== words.length - 1) {
        charIdx.push(" ");
      }
      // console.log(charIdx);
      board[i] = charIdx;
    }
    setBoard(board);
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
    fetchSentences();
  }, [toggleMode, toggleTotalWords, toggleDuration]);
  function resetTypeBoard() {
    console.log("resetting board");
    // board
    setGameOver(false);
    setStartGame(false);
    setTimer(toggleDuration);
    setToggleTypeCursor(true);
    setWord(randomWord);
    setDisableBackspaceIdx(null);

    // stats
    setInput("");
    setTime(0);
    setTimeElapsed(0);
    setWordCount(0);
    setWpm(0);
    setRawWpm(0);
    setCorrectLetter(0);
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
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
    if (!toggleTypeCursor) {
      window.addEventListener("keydown", () => {
        setToggleTypeCursor(true);
      });
      return () => {
        window.removeEventListener("keydown", () => {});
      };
    }
  }, [inputRef, toggleTypeCursor]);
  // const [cursorPosition, setCursorPosition] = useState({
  //   x: 0,
  //   y: 0,
  // });
  // const cursorRef = useRef(null);
  // useEffect(() => {
  //   if (startGame) {
  //     const rect = inputRef.current.getBoundingClientRect();

  //     window.addEventListener("keydown", () => {
  //       // console.log("right", rect.right);
  //       // console.log("rect top", rect.top);
  //       setCursorPosition({
  //         x: rect.right,
  //         y: rect.top,
  //       });
  //     });
  //     return () => {
  //       window.removeEventListener("keydown", () => {});
  //     };
  //   }

  // }, [startGame]);

  console.log(loading, saveTest);
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
            <span>{`${correctletter}/${word.length - correctletter}/${
              input.length - word.length
            }/${word.split(" ").length - input.split(" ").length}`}</span>
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
            <Cloudy resetTypeBoard={resetTypeBoard} />
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

              {toggleMode == "words" && (
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
              {toggleMode == "cloudy" && (
                <IoIosInfinite size={"1.5rem"} className={styles.infinite} />
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
              {startGame && toggleMode == "cloudy" && (
                <span>{timeElapsed}</span>
              )}
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
                timer={timer}
                toggleTypeCursor={toggleTypeCursor}
                setToggleTypeCursor={setToggleTypeCursor}
                toggleTotalWords={toggleTotalWords}
                word={word}
                resetTypeBoard={resetTypeBoard}
                toggleMode={toggleMode}
                toggleDuration={toggleDuration}
                gameOver={gameOver}
                setGameOver={setGameOver}
                wordCount={wordCount}
                setWordCount={setWordCount}
                setStartGame={setStartGame}
                timeElapsed={timeElapsed}
                setTimeElapsed={setTimeElapsed}
                time={time}
                setTime={setTime}
                startGame={startGame}
                input={input}
                setInput={setInput}
                inputRef={inputRef}
                disableBackspaceIdx={disableBackspaceIdx}
                setDisableBackspaceIdx={setDisableBackspaceIdx}
                board={board}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
