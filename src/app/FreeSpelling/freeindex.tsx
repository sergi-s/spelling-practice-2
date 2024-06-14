"use client"
import React, { useState } from "react";
import styles from './backgroundGradient.module.css';
import { ShortcutInstructions } from "~/app/components/ShortcutInstructions";
import { TopicsSelect } from "../components/TopicsSelect";
import { type TopicOption } from "types/types";
import SentenceComponent from "../components/Sentence";
import useFreeSentenceManagement from "../../hooks/useSentenceManagement";
import SpellChecker from "../components/SpellChecker";
import { BlurToggleComponent } from "../components/BlurToggleComponent";


const SpellingFreePage = () => {


    const [selectedOption, setSelectedOption] = useState<TopicOption | undefined>(undefined);
    const { currentSentence, handleNext, currentSentenceRef } = useFreeSentenceManagement({ selectedTopic: selectedOption });
    const [userInput, setUserInput] = useState('');


    const [misspelledWords, setMisspelledWords] = useState<Array<string>>([]);
    const [isSpellChecking, setIsSpellChecking] = useState(false);


    const handleWrongWordsChange = (words: string[]) => { setMisspelledWords(prev => [...new Set([...words, ...prev])]) };

    return (
        <div className={styles.pageContainer}>
            <h2 className="col-span-2 mb-6 mt-6 text-center text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg text-transparent bg-clip-text">
                LexIA {selectedOption?.value}
            </h2>
            <ShortcutInstructions />

            <TopicsSelect authed={false} onOptionChange={setSelectedOption} />

            <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">

                <SpellChecker correctSentence={currentSentence?.phrase ?? "wait 1 sec"}
                    onWrongWordsChange={handleWrongWordsChange}
                    setUserInput={setUserInput}
                    userInput={userInput}
                    isSpellChecking={isSpellChecking}
                    setIsSpellChecking={setIsSpellChecking}
                />

                <SentenceComponent
                    currentSentence={currentSentence!}
                    currentSentenceRef={currentSentenceRef}
                    handleNext={() => { handleNext(); setUserInput(''); setIsSpellChecking(false) }}
                />


                {/* misspelledWords:{misspelledWords.join(' ')} */}
                <BlurToggleComponent words={misspelledWords.filter(Boolean)} />

            </div>

        </div>
    );
};

export default SpellingFreePage;
