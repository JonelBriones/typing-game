"use client";

import { useEffect, useState } from "react";
type Test = {
  user: string;
  seconds: number;
  words: number;
  wpm: number;
  raw: number;
  language: string;
  mode: string;
};
const test = {
  user: "",
  seconds: 0,
  words: 0,
  wpm: 0,
  raw: 0,
  language: "",
  mode: "",
};
const useGameLogic = ({
  user = null,
  generatedWord,
  toggleTotalWords,
  language,
  toggleMode,
  input,
  time,
}: any) => {
  const [correctLettersCount, setCorrectLetterCount] = useState(0);
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

    setCorrectLetterCount(correctLettersCount);

    return {
      user: user?.username || "Guest",
      words: toggleTotalWords,
      mode: toggleMode,
      language,
      wpm: parseFloat(wpm.toFixed(2)),
      raw: parseFloat(raw.toFixed(2)),
      seconds: parseFloat(timer.toFixed(2)),
      correctLettersCount,
    };
  }
  return { handleWpmConversion };
};
export default useGameLogic;
