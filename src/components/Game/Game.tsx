import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";

import styles from "./Game.module.scss";
const Game = () => {
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
  const [loadingWords, setLoadingWords] = useState(true);
  const wrapper = document.getElementById("wrapper");
  const isDark = wrapper?.classList[1] == "dark";

  function handleOnchangeInput(e) {
    let input = e.target.value;

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
    if (inputRef.current) {
      inputRef?.current.focus();
    }
  }, [inputRef, inputRef?.current]);

  const modes = ["time", "words", "quote", "zen"];
  const durations = ["15", "30", "60"];

  async function fetchWords() {
    // let words
    let length = Math.floor(Math.random() * (50 - 1 + 1) + 1);
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${10}`
    ).then((res) => res.json());

    console.log(res);
    console.log(res.join(" "));
    setRandomWord(res.join(" "));
    setWord(res.join(" "));
  }

  useEffect(() => {
    // if (loadingWords) {
    //   fetchWords();
    // }
    // setLoadingWords(false);
    console.log(randomWord);
  }, []);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.modes}`}>
        {modes.map((mode) => (
          <button
            className={`button ${styles.option}`}
            key={mode}
            onClick={fetchWords}
          >
            {mode}
          </button>
        ))}
        {durations.map((duration) => (
          <button className={`button ${styles.option}`} key={duration}>
            {duration}
          </button>
        ))}
      </div>
      <div className={`${styles.game}`}>
        {gameOver && <p>Success</p>}
        {!toggleTypeCursor && (
          <div className={styles.gameFocus}>
            <p>click here or press any key to focus</p>
          </div>
        )}
        <div
          id="cursor"
          onClick={inputRef?.current?.focus()}
          className={`${styles.typeFieldContainer} ${
            !toggleTypeCursor && styles.blur
          }`}
        >
          <p className={`${styles.words}`}>
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
          </p>
          <input
            autoComplete="false"
            spellCheck="false"
            id="gameTypeInput"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleOnchangeInput(e)}
            onFocus={() => setToggleTypeCursor(true)}
            // onBlur={() => setToggleTypeCursor(false)}
          />
        </div>

        <button>
          <MdRefresh
            size={"1.5rem"}
            onClick={() => {
              setInputValue("");
              setGameOver(false);
              setDisableBackspaceIdx(0);
              setCompletedWord(0);
            }}
          />
        </button>
      </div>
      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
