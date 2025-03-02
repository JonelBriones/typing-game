import React from "react";
import styles from "./Word.module.scss";
interface Props {
  word: string;
  inputValue: String;
  isValid: boolean;
}
const Word = ({ word, inputValue, isValid }: Props) => {
  //   return <input className={`${styles}`} placeholder={word} readOnly />;
  return (
    <>
      <p className={`${styles}`}>
        {word.split("").map((letter) => (
          <span className={`${isValid ? styles.valid : styles.error}`}>
            {letter}
          </span>
        ))}
      </p>
    </>
  );
};

export default Word;
