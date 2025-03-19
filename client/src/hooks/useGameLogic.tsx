"use client";
import data from "../../data.json";

import { useEffect, useState } from "react";

const useGameLogic = ({
  user = null,
  toggleDuration,
  inputRef,
  toggleTotalWords,
  toggleMode,
  initialHeight,
  setTextHeight,
  typingContainerElement,
}: any) => {
  const [generatedWord, setGeneratedWord] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [disableGame, setDisableGame] = useState(false);
  const [board, setBoard] = useState<any>([]);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [input, setInput] = useState("");
  const [time, setTime] = useState<number>(toggleDuration);
  const [timeElapsed, setTimeElapsed] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [afkTimer, setAfkTimer] = useState(null);
  const [countdown, setCountdown] = useState(toggleDuration);

  const [afk, setAfk] = useState(false);
  const [disableBackspaceIdx, setDisableBackspaceIdx] = useState<number | null>(
    null
  );
  const language = "English";
  const [extraInputs, setExtraInputs] = useState(null);

  async function fetchSentences() {
    resetTypeBoard();
    let random = () => Math.floor(Math.random() * 200);
    let selectedWords = [];
    const totalWords = toggleMode == "words" ? toggleTotalWords : 200;
    while (selectedWords.length <= totalWords - 1) {
      selectedWords.push(data.commonWords[random()]);
    }
    let words = selectedWords.join(" ");
    setGeneratedWord(words);
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
      board[i] = charIdx;
    }
    setBoard(board);
  }

  async function resetTypeBoard() {
    // board
    setGameOver(false);
    setStartGame(false);
    setWord(generatedWord);
    setDisableBackspaceIdx(null);
    setCountdown(toggleDuration);
    if (typingContainerElement) {
      typingContainerElement.style.marginTop = `0px`;
      setTextHeight(initialHeight);
    }

    // stats

    setInput("");
    setTime(toggleDuration);
    setTimeElapsed(null);
    setWordCount(0);
    // setDisableGame(true);
    // await sleep(1000);
    // setDisableGame(false);
    inputRef.current.focus();
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleWpmConversion() {
    if (generatedWord == null) return;
    let correctLettersCount = 0;
    for (let i = 0; i < generatedWord.length; i++) {
      if (generatedWord[i] == input[i]) {
        correctLettersCount++;
      }
    }

    const timer = (Date.now() - time) / 1000;
    const wordsTyped = correctLettersCount / 5;
    const wpm = (wordsTyped * 60) / timer;
    const raw = ((input.length / 5) * 60) / timer;
    let SECONDS =
      toggleMode == "words" ? parseFloat(timer.toFixed(2)) : toggleDuration;
    console.log("mode", toggleMode);
    return {
      user: user?.username || "Guest",
      words: toggleTotalWords,
      mode: toggleMode,
      language,
      wpm: parseFloat(wpm.toFixed(2)),
      raw: parseFloat(raw.toFixed(2)),
      seconds: SECONDS,
      correctLettersCount,
    };
  }

  useEffect(() => {
    fetchSentences();
  }, [toggleMode, toggleTotalWords, toggleDuration]);

  return {
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
    inputRef,
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
    setExtraInputs,
  };
};
export default useGameLogic;
