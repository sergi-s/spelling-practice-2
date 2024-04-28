import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

export const useSentenceAPI = () => {
    const { speak } = useSpeechSynthesis();

    const [sentence, setSentence] = useState<{ phrase: string, id: string }>();


    const fetchNewSentence = async (difficulty?: number) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds')) || [];
            const response = await fetch(`/api/phrase/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentenceIds, difficulty }),
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
    }, []);

    return { sentence, fetchNewSentence };
};
