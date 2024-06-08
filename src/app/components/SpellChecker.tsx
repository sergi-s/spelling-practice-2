import React, { useState } from 'react';

const SpellChecker = ({ correctSentence, onWrongWordsChange, userInput, setUserInput }:
    { correctSentence: string, onWrongWordsChange: (value: string[]) => void, userInput: string, setUserInput: (input: string) => void }) => {

    const [isComparing, setIsComparing] = useState(false);

    const compareSentences = () => {
        const correctWords = correctSentence.split(/[ ,.'’]+/);
        const userWords = userInput.split(/[ ,.'’]+/);
        const maxLength = Math.max(correctWords.length, userWords.length);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            const correctWord = correctWords[i] ? correctWords[i]!.toLowerCase() : '';
            const userWord = userWords[i] ? userWords[i]!.toLowerCase() : '';

            if (correctWord === userWord) {
                result.push(
                    <span key={i}>
                        {correctWord}{' '}
                    </span>
                );
            } else {
                result.push(
                    <span key={i}>
                        <span style={{ color: 'green' }}>{userWord}</span>
                        <span style={{ color: 'red' }}> {correctWord}</span>{' '}
                    </span>
                );
            }
        }

        return result;
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            setIsComparing(true);
            const correctWords = correctSentence.split(/[ ,.'’]+/);
            const userWords = userInput.split(/[ ,.'’]+/);
            const wrongWords = correctWords.filter((word, index) => word.toLowerCase() !== userWords[index]?.toLowerCase());
            onWrongWordsChange(wrongWords);
        }
    };

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        if (isComparing) {
            setIsComparing(false);
        }
        setUserInput(e.target.value as string);
    };

    return (
        <div>
            <input
                type="text"
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
            />
            <div>
                {isComparing && compareSentences()}
            </div>
        </div>
    );
};

export default SpellChecker;
