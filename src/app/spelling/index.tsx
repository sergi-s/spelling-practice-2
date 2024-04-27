import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

export const Spelling = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { speak } = useSpeechSynthesis();
    const [sentence, setSentence] = useState<{ phrase: string, id: string }>();
    const [userInput, setUserInput] = useState<string>('');
    const [comparisonResult, setComparisonResult] = useState<boolean | null>(null);

    const fetchNewSentence = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds')) || [];
            const response = await fetch(`/api/phrase/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentenceIds }),
            });
            if (response.ok) {
                const { phrase: newSentence, id } = await response.json() as { phrase: string, id: string };
                setSentence({ phrase: newSentence, id });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                speak({ text: newSentence });
            } else {
                console.error('Failed to fetch new sentence');
            }
        } catch (error) {
            console.error('Error fetching sentence:', error);
        }
    };

    useEffect(() => {
        void fetchNewSentence();
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
                void fetchNewSentence()
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleButtonClick = () => {
        void fetchNewSentence();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds')) || [];
            localStorage.setItem('sentenceIds', JSON.stringify([...sentenceIds, sentence?.id]));
            setComparisonResult(userInput === sentence?.phrase);
        }
    };

    return (
        <div>
            <h1>Generated Sentence</h1>
            <p>{sentence?.phrase}</p>
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleInputSubmit}
                style={{ color: comparisonResult === null ? 'black' : comparisonResult ? 'green' : 'red' }}
            />
            <button onClick={handleButtonClick}>Generate New Sentence</button>
            <br />
            <button id="thisIsAShitSolution" onClick={() => void speak({ text: sentence?.phrase })}>Read Again</button>
        </div>
    );
};
