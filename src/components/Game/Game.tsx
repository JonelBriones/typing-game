import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";

import styles from "./Game.module.scss";
const Game = () => {
  const [randomWord, setRandomWord] = useState("the fox jumped");
  const [word, setWord] = useState(randomWord);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [toggleTypeCursor, setToggleTypeCursor] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [wordsArr, setWordsArr] = useState(randomWord.split(" "));
  const [completedWord, setCompletedWord] = useState(0);

  const [extraInputs, setExtraInputs] = useState("");
  const [checkArrNum, setCheckArrNum] = useState(0);

  const [allowBackspace, setAllowBackspace] = useState(true);
  const [isKeyDownBackspace, setIsKeyDownBackspace] = useState(false);
  const [isKeyDownSpace, setIsKeyDownSpace] = useState(false);
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState(0);
  console.log(wordsArr[checkArrNum]);

  // once a word is completed, prevent backspacing on word

  // the , fox , jumped
  function checkIsWordValid(e) {
    if (e.code == "Space") {
      if (wordsArr[checkArrNum] == inputValue) {
        // setCheckArrNum(checkArrNum + 1);
        // console.log(inputValue.length);
        // setBackSpaceAllowedIdx(inputValue.length + 1);
      }
    }
  }
  function checkAllowedBackspace(e) {
    // console.log(e.code);
    if (e.code == "Backspace") {
      console.log("backspace pressed");
      setIsKeyDownBackspace(true);
    } else {
      setIsKeyDownBackspace(false);
    }
    if (e.code == "Space") {
      console.log("Space pressed");
      setIsKeyDownSpace(true);
    } else {
      setIsKeyDownSpace(false);
    }
  }

  function handleOnchangeInput(e) {
    let input = e.target.value;
    console.log("input", input);
    console.log(input.split(""));
    console.log(isKeyDownSpace);

    console.log(input.length, disableBackspaceIdx);
    if (input.length < disableBackspaceIdx) return;

    if (gameOver) return;
    console.log(isKeyDownBackspace, !allowBackspace);

    // if (isKeyDownBackspace && !allowBackspace) {
    //   return;
    // } else {
    //   setAllowBackspace(true);
    // }

    // if (isKeyDownBackspace && disableBackspaceIdx - 1 == input.length - 1) {
    //   console.log("pressed back and is disabled at idx");
    //   return;
    // }

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
    // if (input == "" && backSpaceAllowedIdx == input.length)
    // check if previous idx was a space
    let arr = input.split("");

    let isPrevValSpace = arr[arr.length - 1] == " ";
    if (isPrevValSpace && input.length > 0) {
      console.log("on a space");
      // is previous values match word at length?
      if (word.slice(0, inputValue.length) == inputValue) {
        console.log(
          "word matches",
          word.slice(0, input.length - 1),
          inputValue
        );
        setCompletedWord(completedWord + 1);
        console.log("setting disabled at ", input.length);
        setDisableBackspaceIdx(input.length);
        // console.log("settings disable backspace at idx", input.length);
        // if (isPrevValSpace) {
        //   setAllowBackspace(false);
        // }
      }
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
      <span>ARR:{checkArrNum}</span>
      <div className={`${styles.options}`}>OPTIONS</div>
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
            autoComplete="false"
            spellCheck="false"
            id="gameTypeInput"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleOnchangeInput(e)}
            onFocus={() => setToggleTypeCursor(true)}
            onBlur={() => setToggleTypeCursor(false)}
            onKeyDown={(e) => {
              checkAllowedBackspace(e);
            }}
          />
        </div>

        <button>
          <MdRefresh
            size={"1.5rem"}
            onClick={() => {
              setInputValue("");
              setGameOver(false);
              setCheckArrNum(0);
            }}
          />
        </button>
      </div>
      <div className={`${styles.footer}`}>bottom container</div>
    </div>
  );
};

export default Game;
