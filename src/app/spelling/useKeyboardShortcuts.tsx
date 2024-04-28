import { useEffect } from 'react';

export const useKeyboardShortcuts = (fetchNewSentence: Function,setCheckSpelling:Function, difficulty?: number) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Digit1') {
                event.preventDefault();
                const button = document.getElementById('thisIsAShitSolution');
                if (button) {
                    button.click();
                }
            }
            if (event.code === 'Digit2') {
                event.preventDefault();
                fetchNewSentence(difficulty);
                setCheckSpelling(false)
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [fetchNewSentence]);
};
