import { type Phrase } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';

const SpellChecker = ({
    correctSentence, onWrongWordsChange, userInput, setUserInput, isSpellChecking, setIsSpellChecking, submitUserPerformance
}:
    {
        correctSentence: Phrase, onWrongWordsChange: (value: string[]) => void, userInput: string,
        setUserInput: (input: string) => void, isSpellChecking: boolean, setIsSpellChecking: (flag: boolean) => void,
        submitUserPerformance?: (userInput: string, sentence: Phrase) => Promise<void>
    }) => {


    const { status } = useSession()

    const compareSentences = () => {
        const correctWords = correctSentence?.phrase.toLowerCase().split(/[ ,.'’]+/) || [];
        const userWords = userInput.toLowerCase().split(/[ ,.'’]+/);
        const maxLength = Math.max(correctWords.length, userWords.length);

        const result = [];
        for (let i = 0; i < maxLength; i++) {
            const correctWord = correctWords[i] ? correctWords[i]! : '';
            const userWord = userWords[i] ? userWords[i]! : '';

            if (correctWord === userWord) {
                result.push(<span key={i}>{correctWord}{' '}</span>);
            } else {
                result.push(
                    <span key={i}>
                        <span style={{ color: 'red' }}><s>{userWord}</s></span>{' '}
                        <span style={{ color: 'green' }}>{correctWord}</span>{' '}
                    </span>
                );
            }
        }

        return result;
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            setIsSpellChecking(true);
            const correctWords = correctSentence.phrase.split(/[ ,.'’]+/);
            const userWords = userInput.split(/[ ,.'’]+/);
            const wrongWords = correctWords.filter((word, index) => word.toLowerCase() !== userWords[index]?.toLowerCase());
            onWrongWordsChange(wrongWords);
            if (status === "authenticated" && submitUserPerformance && !isSpellChecking) {
                // track user performance
                void submitUserPerformance(userInput, correctSentence)
            }
        }
    };

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserInput((e.target.value as string).replace("\n", '').replace('1', '').replace('2', ''));
    };

    return (
        <div className='grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
            {isSpellChecking ? (
                <h1 className="col-span-2 -mb-6 mt-6 text-center text-lg font-bold text-white drop-shadow-lg">
                    Spelling Results
                </h1>
            ) : (
                <h1 className="col-span-2 mb-6 mt-6 text-center text-lg font-bold text-white animated-glow drop-shadow-lg">
                    Start your spelling practice
                </h1>
            )}
            {
                isSpellChecking &&
                <div className="card-wrapper h-[50px] w-[500px]">
                    <div className="card-content col-span-2 px-4 py-2">
                        {compareSentences()}
                    </div>
                </div>
            }
            <div className="col-span-2 w-[100%]">
                <div className="relative w-full min-w-[200px]">
                    <textarea
                        value={userInput}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        className="border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full min-h-[100px] w-full resize-none rounded-[7px] border-2 border-gray-900 bg-white px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0"
                        placeholder=" "
                    ></textarea>
                    <label className="before:content[' '] after:content[' '] text-blue-gray-400 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent">
                        Spelling Practice
                    </label>
                </div>
            </div>

        </div>
    );
};

export default SpellChecker;
