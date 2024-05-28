import IconButton from 'components/IconButton';
import { useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';

import { useSpeechSynthesis } from 'react-speech-kit';

// eslint-disable-next-line @typescript-eslint/ban-types
export const registerShortcut = (shortcut: string[], action: Function, ...params: (number | { value: string; label: string; } | null | undefined)[]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
            if (shortcut.includes(event.key)) {
                event.preventDefault();
                action(...params);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [...params]);
};


export const SpeakButton = ({ text }: { text?: string }): React.ReactNode => {
    if (!text) text = "sorry there is no available text"
    const { speak, cancel } = useSpeechSynthesis();
    return <IconButton id="thisIsAShitSolution" onClick={() => { void cancel(); void speak({ text }) }} color="blue">
        Read Again
        <FaRedo className="ml-4 text-white" />
    </IconButton>

}

export const speak = () => {
    const button = document.getElementById('thisIsAShitSolution');
    if (button) button.click();
}