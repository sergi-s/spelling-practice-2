import React, { useEffect, useState } from 'react';
import { useSentenceAPI } from './useSentenceAPI';
import { SpeakButton, registerShortcut, speak } from './useKeyboardShortcuts';
import { DifficultySelect } from './DifficultySelect';
import { SpellingComparison } from './SpellingComparison';
import { RiArrowRightSLine } from 'react-icons/ri';
import IconButton from 'components/IconButton';
import { ShortcutInstructions } from 'components/ShortcutInstructions';
import CreatableSelect from 'react-select/creatable';


export const Spelling = () => {
    const { sentence, fetchNewSentence } = useSentenceAPI();
    const [userInput, setUserInput] = useState<string>('');
    const [difficulty, setDifficulty] = useState<number>(1);
    const [comparisonResult, setComparisonResult] = useState<{ correct: boolean; missSpelledWords: string[] } | null>(null);

    const [checkSpelling, setCheckSpelling] = useState<boolean>(false);

    const [options, setOptions] = useState<Array<{ value: string, label: string }>>([]);
    const [selectedOption, setSelectedOption] = useState<{ value: string, label: string } | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const uniqueTopics = await (await fetch('/api/topics')).json() as string[];
                const topics: { value: string, label: string }[] = uniqueTopics.map((topic: string) => ({ value: topic, label: topic }));
                setOptions(topics);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);


    const handleChange = (selectedOption: { value: string, label: string }) => {
        console.log("the new selected option is ", selectedOption)
        setSelectedOption(selectedOption);
    };
    const handleCreate = (inputValue: string) => {
        const newOption = { value: inputValue.toLowerCase(), label: inputValue };
        setOptions(prevOptions => [...prevOptions, newOption]);
        setSelectedOption(newOption);
    };

    registerShortcut(['Digit1', '1'], speak);

    registerShortcut(['Digit2', '2'], async function (localDifficulty: number, localSelectedOption: { value: string, label: string }) {
        await fetchNewSentence(localDifficulty, localSelectedOption.value);
        setCheckSpelling(false)
        setUserInput('')
        setTimeout(() => { speak() }, 0);
    }, difficulty, selectedOption)

    const handleButtonClick = () => {
        void fetchNewSentence(difficulty, selectedOption?.value);
        setUserInput('')
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): undefined => {
        setUserInput(event.target.value);
    };

    const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>): undefined => {
        if (event.key !== 'Enter') return;
        setCheckSpelling(true);

        const correctPhrase = (sentence?.phrase ?? '').replace(/[^a-zA-Z\s]/g, ' ').toLowerCase().split(' ');
        const userPhrase = userInput.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase().split(' ');

        const missSpelledWords = correctPhrase.filter((word, index) => word !== userPhrase[index]);
        const isCorrect = missSpelledWords.length === 0;
        setComparisonResult({ correct: isCorrect, missSpelledWords });

        const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds') ?? '[]') as string[];
        localStorage.setItem('sentenceIds', JSON.stringify([...sentenceIds, sentence?.id]));

    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">

            <ShortcutInstructions />
            <div className="container">
                <CreatableSelect
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}
                    onCreateOption={handleCreate}
                    placeholder="Search and select or create a topic..."
                />
                {selectedOption && <div>You selected: {selectedOption.label}</div>}
            </div>

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


// TODO: 1- Add french

// TODO: 2- Auth module, and tracking what words are spelled incorrectly by the user

// TODO; 3- Add an array of topics to the LLM to introduce more randomness and relevancy in generating sentences to be dictated 

// TODO: 4- ReWrite the sentence generator