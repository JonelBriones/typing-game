import React from "react";

const Words = ({ board, styles, input }: any) => {
  return board.map((word, wordIdx) => (
    <span className={styles.word}>
      {word.map((char, charIdx) =>
        // Flattened index
        {
          const charIndex = board.slice(0, wordIdx).flat().length + charIdx;

          return (
            <span
              key={`${wordIdx}-${charIndex}`}
              className={`${char == " " ? styles.space : styles.letter} ${
                input[charIndex] == undefined
                  ? ""
                  : input[charIndex] == char
                  ? styles.valid
                  : styles.error
              } ${input.length == charIndex ? styles.cursor : ""}`}
            >
              {char}
            </span>
          );
        }
      )}
    </span>
  ));
};

export default Words;
