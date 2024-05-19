import React from 'react';

export const SpellingComparison = ({ correctPhrase, missSpelledWords }: { correctPhrase: string[], missSpelledWords: string[] }) => {
    return (
        <div className='col-span-2 px-4 py-2 bg-white text-black rounded border-2 border-gray-300 focus:outline-none focus:border-blue-500'>
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