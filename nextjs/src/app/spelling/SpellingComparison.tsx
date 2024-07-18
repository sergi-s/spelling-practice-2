import React from "react";

export const SpellingComparison = ({
  correctPhrase,
  missSpelledWords,
}: {
  correctPhrase: string[];
  missSpelledWords: string[];
}) => {
  // Create a set of misspelled words for faster lookup and case-insensitive comparison
  const missSpelledSet = new Set(missSpelledWords.map(word => word.toLowerCase()));

  return (
    <div className="card-wrapper h-[50px] w-[500px]">
      <div className="card-content col-span-2 px-4 py-2">
        {correctPhrase.map((word, index) => {
          const wordLower = word.toLowerCase();
          const isMisspelled = missSpelledSet.has(wordLower);
          return (
            <span
              key={index}
              style={{
                color: isMisspelled ? "red" : "green",
                textDecoration: isMisspelled ? "underline" : "none"
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};
