import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useSentenceAPI } from './useSentenceAPI';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { DifficultySelect } from './DifficultySelect';
import { SpellingComparison } from './SpellingComparison'; 

export const Spelling = () => {
    const { speak } = useSpeechSynthesis();
    const { sentence, fetchNewSentence } = useSentenceAPI();
    const [userInput, setUserInput] = useState<string>('');
    const [difficulty, setDifficulty] = useState<number>(1);
    const [comparisonResult, setComparisonResult] = useState<{ correct: boolean; missSpelledWords: string[] } | null>(null);

    const [checkSpelling, setCheckSpelling] = useState<boolean>(false);

    useKeyboardShortcuts(fetchNewSentence, setCheckSpelling, difficulty);

    const handleButtonClick = () => {
        void fetchNewSentence(difficulty);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setCheckSpelling(true);

            const correctPhrase = (sentence?.phrase ?? '').replace(/[^a-zA-Z\s]/g, '').toLowerCase().split(' ');
            const userPhrase = userInput.replace(/[^a-zA-Z\s]/g, '').toLowerCase().split(' ');

            const missSpelledWords = correctPhrase.filter((word, index) => word !== userPhrase[index]);
            const isCorrect = missSpelledWords.length === 0;
            setComparisonResult({ correct: isCorrect, missSpelledWords });
            console.log({ correct: isCorrect, missSpelledWords, correctPhrase, userPhrase });
            
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds')) || [];
            localStorage.setItem('sentenceIds', JSON.stringify([...sentenceIds, sentence?.id]));
            
        }
    };

    return (
        <div>
            <h1>Generated Sentence</h1>
            {/* <p>{sentence?.phrase}</p> */}

            {checkSpelling ?

                <SpellingComparison
                    correctPhrase={sentence?.phrase.split(' ') || []}
                    userPhrase={userInput.split(' ')}
                    missSpelledWords={comparisonResult?.missSpelledWords || []}
                />
                : <></>
            }

            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleInputSubmit}
                style={{ color: 'black' }}
            />

            <button onClick={handleButtonClick}>Generate New Sentence</button>
            <br />
            <button id="thisIsAShitSolution" onClick={() => void speak({ text: sentence?.phrase })}>Read Again</button>

            <DifficultySelect difficulty={difficulty} onChange={setDifficulty} />
        </div>
    );
};
