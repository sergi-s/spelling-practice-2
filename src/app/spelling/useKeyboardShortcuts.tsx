import IconButton from 'components/IconButton';
import { useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';
import { useSpeechSynthesis } from 'react-speech-kit';

export const registerShortcut = (shortcut: string[], action: Function, ...params) => {
    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
            console.log({ wtf: event.key })
            if (shortcut.includes(event.key)) {
                event.preventDefault();
                console.log("An actions should get triggered")
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
    const { speak } = useSpeechSynthesis();
    return <IconButton id="thisIsAShitSolution" onClick={() => void speak({ text })} color="blue">
        Read Again
        <FaRedo className="text-white" />
    </IconButton>

}