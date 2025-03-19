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
  setCountdown,
  afkTimer,
  setAfkTimer,
  typingContainerElement,
  setTextHeight,
  textHeight,
  setValidLetter,
  disableGame,
  resetTypeBoard,
}: any) => {
  const [keydownTime, setKeydownTime] = useState(0);
  const cursorRef = useRef(null);

  const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!toggleTypeCursor) return;
    setAfk(false);
    let input = e.target.value;

    if (input.length == 1) {
      // setToggleTypeCursor(true);
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
      setValidLetter(true);
    } else if (matchCharInWord == " ") {
      // console.log("char needs to be a space");

      if (inputCharArr[inputCharArr.length - 1] == " ") {
        // space in correct position
        setValidLetter(true);
        let currentWord = input.split(" ")[wordCount];
        let isWordMatch = word.split(" ")[wordCount];

        if (currentWord == isWordMatch) {
          // console.log("correct word");
          setDisableBackspaceIdx(input.length);
          setWordCount(wordCount + 1);
        }
      }
    } else {
      setValidLetter(false);
    }
    setKeydownTime(timeElapsed);
    setInput(input);

    const letter =
      document.getElementById(`letter${input.length}`)?.getBoundingClientRect()
        .bottom || 0;

    if (textHeight > 450 && Math.floor(letter) > 400) {
      const style = window.getComputedStyle(typingContainerElement);
      const marginVal = parseFloat(style.getPropertyValue("margin-top"));
      typingContainerElement.style.marginTop = `${marginVal - 45}px`;
      setTextHeight(textHeight - 45);
    }

    if (
      input.split("")[input.split("").length - 1] ==
        word.split("")[word.split("").length - 1] &&
      input.length == word.length
    ) {
      setGameOver(true);
      setStartGame(false);
      setDisableBackspaceIdx(null);
    }
  };

  useEffect(() => {
    // tracks test time completion
    if (startGame) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - time) / 1000);
        setTimeElapsed(elapsedTime);

        // track line position
        if (elapsedTime >= toggleDuration && toggleMode == "time") {
          clearInterval(intervalId);
        }
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
    if (timeElapsed - keydownTime >= 60 && startGame && !toggleTypeCursor) {
      // record the afk time, show afk warning if user also leaves page?
      setAfk(true);
      resetTypeBoard();
    }
  }, [timeElapsed, time]);

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
          disabled={disableGame}
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
