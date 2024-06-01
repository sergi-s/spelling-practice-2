import React from "react";

export const SpellingComparison = ({
  correctPhrase,
  missSpelledWords,
}: {
  correctPhrase: string[];
  missSpelledWords: string[];
}) => {
  return (
    <div className="card-wrapper h-[50px] w-[500px]">
      <div className="card-content col-span-2 px-4 py-2">
        {correctPhrase.map((word, index) => (
          <span
            key={index}
            style={{ color: missSpelledWords.includes(word) ? "red" : "green" }}
          >
            {word}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};
