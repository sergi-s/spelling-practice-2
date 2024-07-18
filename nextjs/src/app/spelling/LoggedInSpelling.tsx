"use client"
import React, { useEffect, useState } from "react";
import styles from '../components/backgroundGradient.module.css';
import { ShortcutInstructions } from "~/app/components/ShortcutInstructions";
import { TopicsSelect } from "../components/TopicsSelect";
import { type TopicOption } from "types/types";
import SentenceComponent from "../components/Sentence";
import SpellChecker from "../components/SpellChecker";
import { BlurToggleComponent } from "../components/BlurToggleComponent";
import useAuthedSentenceManagement from "~/hooks/useAuthedSentenceManagement";
import { useSession } from "next-auth/react";
import { getUserInfo } from "../api/user/actions";
import { type User } from "@prisma/client";


const AuthedSpelling = () => {

    const [userInfo, setUserInfo] = useState<User & { wordsStrugglingWith: string[] }>()

    useEffect(() => {
        void getUserInfo().then(setUserInfo)
    }, [])

    const { status } = useSession()
    const [selectedOption, setSelectedOption] = useState<TopicOption | undefined>(undefined);
    const { currentSentence, handleNext, currentSentenceRef, submitUserPerformance } = useAuthedSentenceManagement({ selectedTopic: selectedOption });
    const [userInput, setUserInput] = useState('');


    const [misspelledWords, setMisspelledWords] = useState<Array<string>>([]);
    const [isSpellChecking, setIsSpellChecking] = useState(false);


    const handleWrongWordsChange = (words: string[]) => { setMisspelledWords(prev => [...new Set([...words, ...prev])]) };

    return (
        <div className={styles.freePageContainer}>

            {/* {status == "authenticated" ? `user info:${JSON.stringify(userInfo)}` : ''} */}
            <h2 className="col-span-2 mb-6 mt-6 text-center text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg text-transparent bg-clip-text">
                LexIA {selectedOption?.value}
            </h2>
            <ShortcutInstructions />

            <TopicsSelect onOptionChange={setSelectedOption} />

            <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">

                <SpellChecker correctSentence={currentSentence!}
                    onWrongWordsChange={handleWrongWordsChange}
                    setUserInput={setUserInput}
                    userInput={userInput}
                    isSpellChecking={isSpellChecking}
                    setIsSpellChecking={setIsSpellChecking}
                    submitUserPerformance={submitUserPerformance}
                />

                <SentenceComponent
                    currentSentence={currentSentence!}
                    currentSentenceRef={currentSentenceRef}
                    handleNext={() => { handleNext(); setUserInput(''); setIsSpellChecking(false) }}
                />

                <BlurToggleComponent words={misspelledWords.filter(Boolean)} />

            </div>
            {/* <button onClick={() => {
                const str = "I can not stop the milk production."
                const res = saveSentenceByMe(str)
                alert(JSON.stringify(res))
            }}>
                Click ME
            </button> */}

        </div>
    );
};

export default AuthedSpelling;
