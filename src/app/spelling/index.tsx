import React, { useState } from 'react';
import { useSentenceAPI } from './useSentenceAPI';
import { SpeakButton, registerShortcut } from './useKeyboardShortcuts';
import { DifficultySelect } from './DifficultySelect';
import { SpellingComparison } from './SpellingComparison';
import { RiArrowRightSLine } from 'react-icons/ri';
import IconButton from 'components/IconButton';

export const Spelling = () => {
    const { sentence, fetchNewSentence } = useSentenceAPI();
    const [userInput, setUserInput] = useState<string>('');
    const [difficulty, setDifficulty] = useState<number>(1);
    const [comparisonResult, setComparisonResult] = useState<{ correct: boolean; missSpelledWords: string[] } | null>(null);

    const [checkSpelling, setCheckSpelling] = useState<boolean>(false);

    registerShortcut(['Digit1', '1'], () => {
        const button = document.getElementById('thisIsAShitSolution');
        if (button) button.click();
    });

    registerShortcut(['Digit2', '2'], async function () {
        await fetchNewSentence(difficulty);
        setCheckSpelling(false)
        setUserInput('')
    })

    const handleButtonClick = () => {
        void fetchNewSentence(difficulty);
        setUserInput('')
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        setCheckSpelling(true);

        const correctPhrase = (sentence?.phrase ?? '').replace(/[^a-zA-Z\s]/g, ' ').toLowerCase().split(' ');
        const userPhrase = userInput.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase().split(' ');

        console.log({ correctPhrase, userPhrase });

        const missSpelledWords = correctPhrase.filter((word, index) => word !== userPhrase[index]);
        const isCorrect = missSpelledWords.length === 0;
        setComparisonResult({ correct: isCorrect, missSpelledWords });

        const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds') ?? '[]') as string[];
        localStorage.setItem('sentenceIds', JSON.stringify([...sentenceIds, sentence?.id]));

    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 max-w-lg">
                <h1 className="col-span-2 text-center">Generated Sentence</h1>

                {checkSpelling &&
                    <SpellingComparison
                        correctPhrase={sentence?.phrase.split(' ') ?? []}
                        userPhrase={userInput.split(' ')}
                        missSpelledWords={comparisonResult?.missSpelledWords ?? []}
                    />}

                <textarea
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputSubmit}
                    className="col-span-2 px-4 py-2 bg-white text-black rounded border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                />



                <SpeakButton text={sentence?.phrase} />

                <IconButton onClick={handleButtonClick} color="green">
                    Generate New Sentence
                    <RiArrowRightSLine className="text-white" />
                </IconButton>

                <DifficultySelect difficulty={difficulty} onChange={setDifficulty} />
            </div>
        </div>
    );
};



// TODO: 1- Some UI for instructions
// TODO: when pressing 2 / generating a new sentence, clear the text filed, and try to stop the speech if possible
// TODO: 2- test and flush out the bugs
// TODO: 3- Auth module, and tracking what words are spelled incorrectly by the user