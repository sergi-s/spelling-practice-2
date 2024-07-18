import { useEffect } from "react";


type RegisterShortcutParams = {
    key: string[];
    callback: () => void;
};

export const useKeyboardShortcuts = ({ key, callback }: RegisterShortcutParams) => {

    // Define the type for the event parameter explicitly
    const handleKeyPress = (event: KeyboardEvent) => {
        if (key.includes(event.key)) {
            event.preventDefault()
            callback();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [key]);
};
