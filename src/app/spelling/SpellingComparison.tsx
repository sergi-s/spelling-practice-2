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


// TODO: 1- More cleaning 
// TODO: 3- Add some styling

// TODO: 4- another module for logged in users and do analysis
