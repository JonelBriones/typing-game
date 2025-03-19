import { useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";

import styles from "./Game.module.scss";
import { IoIosInfinite } from "react-icons/io";

import { saveTest } from "../../api/tests.ts";
import Cloudy from "./cloudy/Cloudy.js";
import Board from "./board/Board.tsx";
import { useAuthContext } from "../../AuthProvider.tsx";
import useGameLogic from "../../hooks/useGameLogic.tsx";
// type Test = {
//   user: string;
//   seconds: number;
//   words: number;
//   wpm: number;
//   raw: number;
//   language: string;
//   mode: string;
// };
const test = {
  user: "",
  seconds: 0,
  words: 0,
  wpm: 0,
  raw: 0,
  language: "",
  mode: "",
};
const Game = () => {
  const { user } = useAuthContext();

  const quotes = ["short", "medium", "long"];
  const modes = ["time", "words", "cloudy"];
  const [toggleMode, setToggleMode] = useState("words");

  const durations = [15, 30, 60, 120];
  const [toggleDuration, setToggleDuration] = useState(15);
  const totalWords = [10, 25, 50, 100];
  const [toggleTotalWords, setToggleTotalWords] = useState(10);
  // const cloudyDifficulty = ["easy", "medium", "hard", "expert"];

  const [validLetter, setValidLetter] = useState(false);
  const typingContainerElement = document.getElementById("typingContainer");

  const [testData, setTestData] = useState<any | null>(test);
  const [initialHeight, setInitialHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);

  const {
    generatedWord,
    word,
    disableGame,
    board,
    startGame,
    gameOver,

    input,
    time,
    timeElapsed,
    wordCount,
    afkTimer,
    afk,
    disableBackspaceIdx,
    extraInputs,
    countdown,
    setCountdown,
    handleWpmConversion,
    resetTypeBoard,
    setGameOver,
    setWordCount,
    setStartGame,
    setTimeElapsed,
    setTime,
    setInput,
    sleep,
    setDisableGame,
    fetchSentences,
    setDisableBackspaceIdx,
    setAfk,
    setAfkTimer,
  } = useGameLogic({
    user,
    inputRef,
    toggleTotalWords,
    toggleMode,
    toggleDuration,
    setToggleTypeCursor,

    initialHeight,
    setTextHeight,
    typingContainerElement,
    setInitialHeight,
  });

  async function saveHandler() {
    if (afk || toggleMode == "cloudy" || !user) return;
    console.log("savinig test", testData);
    return;
    const res = await saveTest(testData);

    if (!res) {
      console.error("Failed to save test. Pleast try again.");
    }

    console.log(res);
  }
  useEffect(() => {
    function handleResize() {
      if (!typingContainerElement) return;
      let height = Math.floor(
        typingContainerElement?.getBoundingClientRect().bottom
      );
      setTextHeight(height);
      setInitialHeight(height);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [generatedWord]);

  useEffect(() => {
    if (gameOver) {
      setTestData(handleWpmConversion());

      // customize cloud speed & position
      let duration = () => Math.floor(Math.random() * (7 - 3 + 1)) + 3;
      let positionY = () => Math.floor(Math.random() * 100);
      const clouds = document.getElementsByClassName("cloudyImg");
      Array.from(clouds).forEach((cloud) => {
        if (cloud instanceof HTMLElement) {
          cloud?.style.setProperty("--animation-time", duration() + "s");
          cloud?.style.setProperty("top", positionY() + "px");
        }
      });
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) return;
    saveHandler();
  }, [testData]);

  // async function fetchQuotes() {
  //   resetTypeBoard();
  //   let random = () => Math.floor(Math.random() * 200);
  //   // let selectedWords = [];
  //   // while (selectedWords.length <= toggleTotalWords) {
  //   //   selectedWords.push(data.commonWords[random()]);
  //   // }
  //   let quote = data.quotes[random()];
  //   // let sentences = data.commonWords.filter((data) => data.total == total);
  //   setGeneratedWord(quote);
  //   setWord(quote);
  // }

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
      // setToggleTypeCursor(true);
      inputRef?.current?.focus();
    }
  }, [inputRef, toggleTypeCursor]);

  const showTestResult = () => {
    if (testData.mode == "words") {
      return (
        <span>
          {`${testData.correctLettersCount}/${
            word.length - testData.correctLettersCount
          }/${word.length - input.length}/${word.length - input.length}`}
        </span>
      );
    }
    if (testData.mode == "time") {
      return (
        <span>
          {`${testData.correctLettersCount}/${
            input.length - testData.correctLettersCount
          }/0/0`}
        </span>
      );
    }
  };

  return (
    <div className={`${styles.container}`}>
      <div
        className={`${styles.results} ${gameOver ? styles.show : styles.hide}`}
      >
        <div className={styles.cloudyImgContainer}>
          {randomCloudGenerate()}
          {randomCloudGenerate()}
          {randomCloudGenerate()}
          {randomCloudGenerate()}
        </div>

        {gameOver && (
          <>
            <p>WPM:{Math.round(testData.wpm)}</p>
            <div className={styles.resultStatsContainer}>
              <p>
                <span>test type</span>
                <span>
                  {testData.mode} {testData.toggleTotalWords}{" "}
                  {testData.language.toLocaleLowerCase()}
                </span>
              </p>
              <p>
                <span>raw</span>
                <span>{Math.round(testData.raw)}</span>
              </p>
              <p>
                <span>characters</span>
                {/* correct/inncorrect/extra/missed(letters didnt complete/timed)*/}
                {showTestResult()}
              </p>
              {/* <p>
                    <span>consistency</span>
                    <span>#%</span>
                 </p> */}
              <p>
                <span>time</span>
                <span>
                  {testData.mode == "words"
                    ? Math.round(testData.seconds)
                    : toggleDuration}
                  s
                </span>
                {/* <span>hover{testData.seconds}</span> */}
              </p>
            </div>
          </>
        )}

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
      <div className={!gameOver ? styles.show : styles.hide}>
        {/* CLOUDY ITEM */}
        {startGame && toggleMode == "cloudy" && (
          <div className={styles.cloudy}>
            <Cloudy
              resetTypeBoard={resetTypeBoard}
              validLetter={validLetter}
              generatedWord={generatedWord}
              input={input}
              wordCount={wordCount}
              sleep={sleep}
              setDisableGame={setDisableGame}
            />
          </div>
        )}
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
                  setToggleMode(mode);
                  resetTypeBoard();
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className={styles.optionBreaker} />
          {toggleMode == "cloudy" && (
            <div className={styles.infinite}>
              <IoIosInfinite size={"1.5rem"} />
            </div>
          )}

          <div className={styles.modeSettings}>
            {toggleMode == "time" &&
              durations.map((duration) => (
                <button
                  className={`${styles.optionBtn} ${
                    duration == toggleDuration && styles.toggle
                  }`}
                  key={duration}
                  onClick={() => {
                    setToggleDuration(duration);
                    setTime(toggleDuration);
                    resetTypeBoard();
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
                      resetTypeBoard();
                    }}
                  >
                    {total}
                  </button>
                ))}
              </>
            )}
            {/* {toggleMode == "cloudy" && (
              <>
                {cloudyDifficulty.map((difficulty) => (
                  <button
                    className={`${styles.optionBtn} ${
                      difficulty == toggleDifficulty && styles.toggle
                    }`}
                    key={difficulty}
                    onClick={() => {
                      setDifficulty(difficulty);
                      resetTypeBoard();
                    }}
                  >
                    {difficulty}
                  </button>
                ))}
              </>
            )} */}
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
        <div className={styles.game}>
          <div className={`${styles.timer}`}>
            {startGame && toggleMode == "time" && <span>{countdown}</span>}
            {startGame && toggleMode == "cloudy" && <span>{timeElapsed}</span>}
            {startGame && toggleMode == "words" && toggleTypeCursor && (
              <span>
                {wordCount}/{toggleTotalWords}
              </span>
            )}
          </div>

          {afk && (
            <div
              className={`${styles.afk} ${
                afk ? styles.afkWarning : styles.afkHide
              }`}
            >
              <p>inactivity detected</p>
            </div>
          )}

          <Board
            toggleTypeCursor={toggleTypeCursor}
            setToggleTypeCursor={setToggleTypeCursor}
            word={word}
            extraInputs={extraInputs}
            gameOver={gameOver}
            toggleMode={toggleMode}
            toggleDuration={toggleDuration}
            setGameOver={setGameOver}
            wordCount={wordCount}
            setWordCount={setWordCount}
            setStartGame={setStartGame}
            input={input}
            setInput={setInput}
            setTimeElapsed={setTimeElapsed}
            startGame={startGame}
            time={time}
            setTime={setTime}
            inputRef={inputRef}
            disableBackspaceIdx={disableBackspaceIdx}
            setDisableBackspaceIdx={setDisableBackspaceIdx}
            board={board}
            timeElapsed={timeElapsed}
            setAfk={setAfk}
            setCountdown={setCountdown}
            afkTimer={afkTimer}
            setAfkTimer={setAfkTimer}
            typingContainerElement={typingContainerElement}
            setTextHeight={setTextHeight}
            textHeight={textHeight}
            setValidLetter={setValidLetter}
            disableGame={disableGame}
            resetTypeBoard={resetTypeBoard}
          />
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
  );
};

export default Game;
