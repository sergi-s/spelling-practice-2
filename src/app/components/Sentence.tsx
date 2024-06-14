import React, { type MutableRefObject } from 'react';
import { type Phrase } from '@prisma/client';
import { useSpeechSynthesis } from 'react-speech-kit';
import IconButton from './IconButton';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { RiArrowRightSLine } from 'react-icons/ri';

const SentenceComponent = ({ currentSentence, handleNext, currentSentenceRef }: { currentSentence: Phrase, currentSentenceRef: MutableRefObject<string | null | undefined>, handleNext: () => void }) => {

    const { speak, cancel } = useSpeechSynthesis()

    const read = () => { cancel(); speak({ text: currentSentence?.phrase ?? "Sorry I ran out of  sentences" }) }
    const next = () => { handleNext(); cancel(); speak({ text: currentSentenceRef?.current ?? "Sorry I ran out of  sentences" }) }

    useKeyboardShortcuts({ key: ["Digit1", "1"], callback: read });
    useKeyboardShortcuts({ key: ["Digit2", "2"], callback: next });

    if (!currentSentence) return <h1>No sentence sorry</h1>
    return (
        <>
            {/* <p>{currentSentence.phrase}</p> */}
            <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
  <IconButton color='gradient1' onClick={read}>Read</IconButton>
  <IconButton onClick={next} color='gradient2'>Next <RiArrowRightSLine className="text-white" /></IconButton>
</div>


        </>
    );
};

export default SentenceComponent;
