//! NOTE: old should be deleted
import { useState, useEffect } from 'react';

export const useSentence = () => {

    const [sentence, setSentence] = useState<{ phrase: string, id: string }>();


    const fetchNewSentence = async (difficulty?: number, topic?: string, wrongSpelling?: Array<string> | null) => {

        try {
            console.log("Fetching new sentence");

            wrongSpelling = wrongSpelling?.filter(w => w.length > 0);
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds') ?? '[]') as string[];
            const response = await fetch(`/api/phrase/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentenceIds, difficulty, topic, misspelledWords: wrongSpelling }),
            });
            if (response.ok) {
                console.log({ oldSentence: sentence })
                const { phrase: newSentence, id } = await response.json() as { phrase: string, id: string };
                console.log({ newSentence })
                setSentence({ phrase: newSentence, id });
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
