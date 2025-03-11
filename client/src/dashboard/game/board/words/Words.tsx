const Words = ({ board, styles, input }: any) => {
  return (
    <div className={styles.wordContainer}>
      {board.map((word: string[], wordIdx: number) => (
        <span className={styles.word}>
          {word.map((char: string, charIdx) =>
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
      ))}
    </div>
  );
};

export default Words;
