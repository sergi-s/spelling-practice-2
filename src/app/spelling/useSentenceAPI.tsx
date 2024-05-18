import { useState, useEffect } from 'react';

export const useSentenceAPI = () => {

    const [sentence, setSentence] = useState<{ phrase: string, id: string }>();


    const fetchNewSentence = async (difficulty?: number, topic?: string) => {
        
        // TODO: get array of misspelled words
        try {
            const sentenceIds: string[] = JSON.parse(localStorage.getItem('sentenceIds') ?? '[]') as string[];
            console.log("==================")
            console.log({ topic })
            console.log("==================")
            const response = await fetch(`/api/phrase/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentenceIds, difficulty, topic, /**misspelled words */ }),
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
