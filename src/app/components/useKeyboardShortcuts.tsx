import { useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

type RegisterShortcutParams = {
    key: string[]; // Type for keyboard key, e.g., 'Space'
    callback: () => void; // Callback function that takes no arguments and returns nothing
};

export const useKeyboardShortcuts = () => {
    const { speak, cancel } = useSpeechSynthesis();

    // Define the registerShortcut function with proper types
    const registerShortcut = ({ key, callback }: RegisterShortcutParams) => {
        // console.log(event.key);
        // Define the type for the event parameter explicitly
        const handleKeyPress = (event: KeyboardEvent) => {
            if (key.includes(event.key) ) {
                callback();
            }
        };

        useEffect(() => {
            window.addEventListener("keydown", handleKeyPress);
            return () => {
                window.removeEventListener("keydown", handleKeyPress);
            };
        }, [key, callback]); // Include key and callback in the dependency array
    };

    

    return { speak, cancel, registerShortcut };
};
