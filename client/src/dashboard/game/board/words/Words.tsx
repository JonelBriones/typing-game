const Words = ({ board, styles, input, cursorRef, toggleTypeCursor }: any) => {
  return board.map((word: string[], wordIdx: number) => (
    <span className={`${styles.word}  ${!toggleTypeCursor ? styles.blur : ""}`}>
      {word.map((char: string, charIdx) =>
        // Flattened index
        {
          const charIndex = board.slice(0, wordIdx).flat().length + charIdx;
          let letter = charIdx + board.slice(0, wordIdx).flat().length;
          // console.log(`current word at ${wordIdx + 1}`, letter);
          return (
            <span
              ref={cursorRef}
              key={`${wordIdx}-${charIndex}`}
              id={`letter${letter}`}
              className={`${char == " " ? styles.space : styles.letter} ${
                input[charIndex] == undefined
                  ? ""
                  : input[charIndex] == char
                  ? styles.valid
                  : styles.error
              } ${
                input.length == charIndex && toggleTypeCursor
                  ? styles.cursor
                  : ""
              }`}
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
