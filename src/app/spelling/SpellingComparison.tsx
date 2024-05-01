import React from 'react';

export const SpellingComparison = ({ correctPhrase, userPhrase, missSpelledWords }: { correctPhrase: string[], userPhrase: string[], missSpelledWords: string[] }) => {
    return (
        <div>
            {correctPhrase.map((word, index) => (
                <span
                    key={index}
                    style={{ color: missSpelledWords.includes(word) ? 'red' : 'green' }}
                >
                    {word}
                    {' '}
                </span>
            ))}
        </div>
    );
};