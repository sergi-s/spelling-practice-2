import { useState, useEffect, useCallback, useRef } from 'react';
import { type Phrase } from '@prisma/client';
import { type TopicOption } from 'types/types';
import { authedGetPhrases, recordUserPerformance, type ReturnSentence } from '~/app/api/phrase/actions/authedPhrases';
import { useSession } from 'next-auth/react';

const useAuthedSentenceManagement = ({ selectedTopic }: { selectedTopic?: TopicOption }) => {
    const { data: userData } = useSession()
    const [sentences, setSentence] = useState<Phrase[]>([]);
    const currentSentenceRef = useRef<string>()
    const [currentIndex, setCurrentIndex] = useState(0);
    const take = 2;
    const [skip, setSkip] = useState<number>(0);

    const [currentSentence, setCurrentSentence] = useState<Phrase | null>(null);

    const initialFetchRef = useRef(false);

    const fetchSentences = useCallback(async () => {
        console.log(`Fetching more from ${skip} to ${skip + take}`);
        try {

            const userId = userData?.user.id
            if (!userId) return
            const data = await authedGetPhrases({ topic: selectedTopic?.value, skip, take, userId });
            // const data = await fetchPracticeSentences({ skip: 0, take: 0, difficulty: 0 })
            setSentence((prev) => [...prev, ...data]);
        } catch (error) {
            console.error('Error fetching sentences:', error);
        }
    }, [skip, take, selectedTopic]);

    useEffect(() => {
        if (!initialFetchRef.current) {
            void fetchSentences();
            initialFetchRef.current = true;
        }
    }, [fetchSentences]);

    useEffect(() => {
        if (initialFetchRef.current && skip > 0) {
            void fetchSentences();
        }
    }, [skip, fetchSentences]);

    const handleNext = () => {
        if (currentIndex === sentences.length - 2) {
            setSkip(prevSkip => prevSkip + take);
        }
        setCurrentIndex(prevIndex => prevIndex + 1);
        currentSentenceRef.current = sentences[currentIndex + 1]?.phrase

    };

    const handlePrevious = () => {
        setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    useEffect(() => {
        setCurrentSentence(sentences[currentIndex] ?? null);
    }, [currentIndex, sentences]);

    const submitUserPerformance = async (userInput: string, sentence: Phrase) => {
        await recordUserPerformance({ sentence, userInput })
    }


    return { sentences, currentIndex, handleNext, handlePrevious, currentSentence, currentSentenceRef, submitUserPerformance };
};

export default useAuthedSentenceManagement;

async function fetchPracticeSentences(data: { skip?: number, take?: number, difficulty?: number, topic?: string }) {
    try {
        const response = await fetch('/api/phrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json() as unknown as ReturnSentence[];
    } catch (error) {
        console.error('Error fetching practice sentences:', error);
        return [];
    }
}

