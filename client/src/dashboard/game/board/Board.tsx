import { useEffect, Fragment, useState, useRef } from "react";
import styles from "./Board.module.scss";
import Words from "./words/Words";
const Board = ({
  toggleTypeCursor,
  setToggleTypeCursor,
  word,
  extraInputs,
  gameOver,
  toggleMode,
  toggleDuration,
  setGameOver,
  wordCount,
  setWordCount,
  setStartGame,
  input,
  setInput,
  setTimeElapsed,
  startGame,
  time,
  setTime,
  inputRef,
  disableBackspaceIdx,
  setDisableBackspaceIdx,
  board,
  timeElapsed,
  setAfk,
  toggleTotalWords,
  setCountdown,
  afkTimer,
  setAfkTimer,

  setCurrentLine,
}: any) => {
  const [keydownTime, setKeydownTime] = useState(0);
  const cursorRef = useRef(null);

  const typingContainerElement = document.getElementById("typingContainer");
  const [topValue, setTopValue] = useState(0);
  const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toggleTypeCursor) return;
    setAfk(false);
    let input = e.target.value;

    if (input.length == 1) {
      setToggleTypeCursor(true);
      setStartGame(true);
      setTime(Date.now());
      setAfkTimer(Date.now());
    }
    if (input.length < disableBackspaceIdx) return;

    for (let i = 0; i < word.length - 1; i++) {}

    // if space is valid
    let inputCharArr = input.split("");
    let currentInput = inputCharArr[inputCharArr.length - 1];
    let matchCharInWord = word[inputCharArr.length - 1];
    if (currentInput == matchCharInWord && currentInput !== " ") {
      // console.log("correct letter");
    } else if (matchCharInWord == " ") {
      // console.log("char needs to be a space");

      if (inputCharArr[inputCharArr.length - 1] == " ") {
        // space in correct position

        let currentWord = input.split(" ")[wordCount];
        let isWordMatch = word.split(" ")[wordCount];

        if (currentWord == isWordMatch) {
          // console.log("correct word");
          setDisableBackspaceIdx(input.length);

          setWordCount(wordCount + 1);
          // if (input.split("")[input.split("").length - 1] == " ") {
          //   setWordCount(wordCount + 1);
          // }
        }
      }
    }
    setKeydownTime(timeElapsed);
    setInput(input);

    // track cursor
    const letter = document.getElementById(`letter${input.length}`);
    const nextLetter = letter?.nextElementSibling?.nextElementSibling;

    if (nextLetter) {
      const nextChar = Math.floor(nextLetter?.getBoundingClientRect().bottom);
      //320 - 324
      if (nextChar < 364) {
        setCurrentLine(1);
      } else if (nextChar < 410) {
        setCurrentLine(2);
      } else if (nextChar < 450) {
        if (toggleTotalWords > 25) {
          console.log("top value:", topValue);
          // on min width 758px - ### /takes 4 lines
          if (-45 * 4 == topValue) return;
          let moveTopVal = topValue - 45;
          typingContainerElement.style.top = `${moveTopVal}px`;
          setTopValue(moveTopVal);

          setCurrentLine(3);
        }
      } else {
        console.log("touched");
        // typingContainerElement.style.top = `${
        //   typingContainerElement.style.top - 45
        // }px`;
        // if this is touched
        // (nextChar < 490)
      }
    }

    if (
      input.split("")[input.split("").length - 1] ==
        word.split("")[word.split("").length - 1] &&
      input.length == word.length
    ) {
      setGameOver(true);
      setStartGame(false);
      setDisableBackspaceIdx(null);
      setTopValue(0);
    }
  };

  //282.5
  //335.3000183105469
  // 388.1000061035156
  // useEffect(() => {
  //   if (!startGame) return;
  //   window.addEventListener("keydown", () => {
  //     console.log("key");
  //   });
  //   return () => {
  //     window.removeEventListener("keydown", () => {});
  //   };
  // }, []);

  useEffect(() => {
    // needs to run to configure stats
    if (startGame) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - time) / 1000);
        setTimeElapsed(elapsedTime);

        // track line position
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startGame]);

  useEffect(() => {
    // could join both time useEffects
    if (startGame && toggleMode == "time") {
      let timer = toggleDuration;
      const intervalId = setInterval(() => {
        // mode: word & cloudy / countup
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - afkTimer) / 1000);
        setAfkTimer(elapsedTime);

        // mode: time / countdown

        timer--;
        setCountdown(timer);
        if (timer < 0 || gameOver) {
          clearInterval(intervalId);
          setGameOver(true);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startGame]);

  useEffect(() => {
    // if (timeElapsed - keydownTime >= 5 && startGame) {
    //   // record the afk times, extend timer to a 1minute?
    //   setAfk(true);
    //   resetTypeBoard();
    // }
  }, [timeElapsed, time]);

  // useEffect(() => {
  //   if (startGame) {
  //     window.addEventListener("keydown", () => {
  //       const letter = document.getElementById("currentLetter");
  //       const letterRec = letter?.getBoundingClientRect().top;
  //       console.log("position key press", Math.floor(letterRec));
  //       if (Math.floor(letterRec) < 300) {
  //         setCurrentLine(1);
  //       } else if (Math.floor(letterRec) < 350) {
  //         setCurrentLine(2);
  //       } else {
  //         setCurrentLine(3);
  //       }
  //     });
  //   }
  // }, [startGame]);

  /* 
  typeboard 

  // max of 3 lines
  // if words do not fit inside 3 lines, on 3rd line replace first line for 4th
  if cursor is next to the right div 
  */

  return (
    <div className={styles.typingContainerOverflow}>
      <div id="typingContainer" className={`${styles.typingContainer} `}>
        {!toggleTypeCursor && (
          <div
            className={styles.gameFocus}
            onClick={() => inputRef?.current?.focus()}
          >
            <p>click here or press any key to focus</p>
          </div>
        )}
        <input
          autoComplete="off"
          spellCheck="false"
          id="gameTypeInput"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onHandleInputChange(e)}
          onFocus={() => setToggleTypeCursor(true)}
          onMouseEnter={() => setToggleTypeCursor(true)}
          // onBlur={async () => {
          //   setToggleTypeCursor(false);
          // }}
          className={`${styles.typeInput}`}
          onKeyDown={(e) => {
            if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
              e.preventDefault();
            }
          }}
        />

        <Words
          board={board}
          styles={styles}
          input={input}
          word={word}
          cursorRef={cursorRef}
          toggleTypeCursor={toggleTypeCursor}
        />

        {extraInputs &&
          extraInputs.split("").map((letter: string, idx: number) => (
            <Fragment key={idx}>
              <span className={styles.error}>
                {toggleTypeCursor && idx == input.length && (
                  <span className={styles.cursor} />
                )}
                {letter}
              </span>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Board;
