"use client"
import React, { useState } from "react";
import { ShortcutInstructions } from "~/app/components/ShortcutInstructions";
import { TopicsSelect } from "../components/TopicsSelect";
import { type TopicOption } from "types/types";
import SentenceComponent from "../components/Sentence";
import useFreeSentenceManagement from "../../hooks/useSentenceManagement";
import SpellChecker from "../components/SpellChecker";


const SpellingFreePage = () => {


    const [selectedOption, setSelectedOption] = useState<TopicOption | undefined>(undefined);
    const { currentSentence, handleNext, currentSentenceRef } = useFreeSentenceManagement({ selectedTopic: selectedOption });
    const [userInput, setUserInput] = useState('');


    const [misspelledWords, setMisspelledWords] = useState<Array<string>>([]);

    const handleWrongWordsChange = (words: string[]) => { setMisspelledWords(prev => [...new Set([...words, ...prev])]) };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="col-span-2 mb-6 mt-6 text-center text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg text-transparent bg-clip-text">
                Start your spelling practice NOTE: {selectedOption?.value}
            </h1>
            <ShortcutInstructions />

            <TopicsSelect authed={false} onOptionChange={setSelectedOption} />

            <SentenceComponent
                currentSentence={currentSentence!}
                currentSentenceRef={currentSentenceRef}
                handleNext={() => { handleNext(); setUserInput('') }}
            />

            <SpellChecker correctSentence={currentSentence?.phrase ?? "wait 1 sec"}
                onWrongWordsChange={handleWrongWordsChange}
                setUserInput={setUserInput}
                userInput={userInput}
            />

            misspelledWords:{misspelledWords.join(' ')}

        </div>
    );
};

export default SpellingFreePage;
