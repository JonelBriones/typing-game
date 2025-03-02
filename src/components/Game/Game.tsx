import React, { Fragment, useEffect, useRef, useState } from "react";
import Word from "./Word";
import styles from "./Game.module.scss";
const Game = () => {
  const [randomWord, setRandomWord] = useState("the fox jumped");
  const [word, setWord] = useState(randomWord);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wordsArr, setWordsArr] = useState(randomWord.split(" "));
  const [extraInputs, setExtraInputs] = useState("");
  console.log(wordsArr);
  function handleOnchangeInput(e) {
    if (gameOver) return;

    let input = e.target.value;

    console.log(word.split("").pop());
    console.log(inputValue);
    console.log(input);
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

    setInputValue(input);
  }

  useEffect(() => {
    if (inputRef.current) {
      console.log(inputRef.current);
      inputRef?.current.focus();
    }
  }, [inputRef, inputRef?.current]);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.options}`}>TOP Container</div>
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
          <p>
            {word.split("").map((letter, idx) => (
              <Fragment key={idx}>
                <span
                  className={`${
                    inputValue[idx] == undefined
                      ? ""
                      : letter == inputValue[idx]
                      ? styles.valid
                      : styles.error
                  } ${idx == 0 ? "" : ""}`}
                >
                  {toggleTypeCursor && idx == inputValue.length && (
                    <span className={styles.cursor} />
                  )}
                  {letter}
                </span>
              </Fragment>
            ))}
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
            spellCheck="false"
            id="gameTypeInput"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleOnchangeInput(e)}
            onFocus={() => setToggleTypeCursor(true)}
            onBlur={() => setToggleTypeCursor(false)}
          />
        </div>
        <button
          onClick={() => {
            setInputValue("");
            setGameOver(false);
          }}
        >
          reset
        </button>
      </div>
      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
