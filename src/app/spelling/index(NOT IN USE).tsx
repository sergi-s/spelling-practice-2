"use client"
//! this is deprecated (not in use anymore)
import React, { type ChangeEvent, useState, type KeyboardEvent } from "react";
import styles from '../components/backgroundGradient.module.css';
import { useSentence } from "~/hooks/useSentenceAPI";
import { SpeakButton } from "~/app/components/SpeakButton";
import { useKeyboardShortcuts } from "~/app/components/useKeyboardShortcuts";
import { getSession } from 'next-auth/react';

import { DifficultySelect } from "./DifficultySelect";
import { SpellingComparison } from "./SpellingComparison";
import { RiArrowRightSLine } from "react-icons/ri";
import IconButton from "~/app/components/IconButton";
import { ShortcutInstructions } from "~/app/components/ShortcutInstructions";
import { cleanString } from "../utils/NLP/cleanStrings";
import { useSpeechSynthesis } from "react-speech-kit";
import type { TopicOption } from "types/types";
import { TopicsSelect } from "../components/TopicsSelect";

import BlurToggleComponent from "./BlurToggleComponent";


export const Spelling = () => {
  const { speak, cancel } = useSpeechSynthesis()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { sentence, fetchNewSentence } = useSentence();
  const [userInput, setUserInput] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [comparisonResult, setComparisonResult] = useState<{
    correct: boolean;
    missSpelledWords: string[];
  } | null>(null);

  const [checkSpelling, setCheckSpelling] = useState<boolean>(false);
  const [storeWrongSpelling, setStoreWrongSpelling] = useState<string[]>([]);

  const [selectedOption, setSelectedOption] = useState<TopicOption | null>(null);
  const [showInstructions, setShowInstructions] = useState(false); // New state for instructions visibility


  const handleOptionChange = (selectedValue: TopicOption) => {
    setSelectedOption(selectedValue);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleButtonClick = () => {
    void fetchNewSentence(difficulty, selectedOption?.value, storeWrongSpelling);
    setCheckSpelling(false);
    setUserInput("");
    speak({ text: sentence?.phrase ?? "" });
  };


  const generateNewSentence = () => {
    void fetchNewSentence(difficulty, selectedOption?.value, storeWrongSpelling);
    setCheckSpelling(false);
    setUserInput("");
    cancel();
    setTimeout(() => { cancel(); speak({ text: sentence?.phrase ?? "there is nothing to say" }) }, 0);
  };

  useKeyboardShortcuts({ key: ["Digit2", "2"], callback: generateNewSentence });
  useKeyboardShortcuts({ key: ["Digit1", "1"], callback: () => { cancel(); speak({ text: sentence?.phrase ?? "" }) } });



  // Handles changes to the textarea
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value.replace("\n", '').replace('1', '').replace('2', ''));
  };

  // Handles key presses in the textarea
  const handleInputSubmit = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    setCheckSpelling(true);

    const correctPhrase = cleanString(sentence?.phrase ?? "").split(" ");
    const userPhrase = cleanString(userInput).split(" ");
    const missSpelledWords = correctPhrase.filter((word, index) => word !== userPhrase[index]);

    setComparisonResult({ correct: missSpelledWords.length === 0, missSpelledWords });
    setStoreWrongSpelling(prev => [...new Set([...missSpelledWords, ...prev])]);
  };


  return (

    <div className={styles.pageContainer}>
      <h2 className="col-span-2 mb-6 mt-6 text-center text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg text-transparent bg-clip-text">
        LitIA - Logged in  {selectedOption?.value}
      </h2>
      <ShortcutInstructions />
      <div className="container m-2 p-2">
        <h1>Topics Selection</h1>
        <TopicsSelect onOptionChange={handleOptionChange} />
        {selectedOption && <div>You selected: {selectedOption.label}</div>}
      </div>

      <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        {checkSpelling ? (
          <h1 className="col-span-2 -mb-6 mt-6 text-center text-lg font-bold text-blue-700 drop-shadow-lg">
            Generated Sentence
          </h1>
        ) : (
          <h1 className="col-span-2 mb-6 mt-6 text-center text-lg font-bold text-white animated-glow drop-shadow-lg">
            Start your spelling practice
          </h1>
        )}
        {checkSpelling && (
          <SpellingComparison
            correctPhrase={cleanString(sentence?.phrase ?? "").split(" ")}
            missSpelledWords={comparisonResult?.missSpelledWords ?? []}
          />
        )}
        <div className="col-span-2 w-[100%]">
          <div className="relative w-full min-w-[200px]">
            <textarea
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              className="border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full min-h-[100px] w-full resize-none rounded-[7px] border-2 border-gray-900 bg-white px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0"
              placeholder=" "
            ></textarea>
            <label className="before:content[' '] after:content[' '] text-blue-gray-400 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent">
              Spelling Practice
            </label>
          </div>
        </div>

      </div>
      <div className="flex flex-col items-center col-span-2">
        <DifficultySelect difficulty={difficulty} onChange={setDifficulty} />
        <br />

        <div className="flex w-full space-x-4">
          <SpeakButton text={sentence?.phrase} />
          <IconButton onClick={handleButtonClick} color="gradient1" >
            Next <RiArrowRightSLine className="text-white" />
          </IconButton>
        </div>
      </div>

      {/* misspelledWords:{misspelledWords.join(' ')} */}
      <BlurToggleComponent words={comparisonResult?.missSpelledWords?.filter(Boolean) ?? []} />

    </div>
  );
};

export default Spelling;
