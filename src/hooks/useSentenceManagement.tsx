import { useState, useEffect, useCallback, useRef } from 'react';
import { getFreePhrases } from '../app/api/phrase/actions/freePhrases';
import { type Phrase } from '@prisma/client';
import { type TopicOption } from 'types/types';

const useFreeSentenceManagement = ({ selectedTopic }: { selectedTopic?: TopicOption }) => {
    const [sentences, setSentences] = useState<Phrase[]>([]);
    const currentSentenceRef = useRef<string>()
    const [currentIndex, setCurrentIndex] = useState(0);
    const take = 10;
    const [skip, setSkip] = useState<number>(0);

    const [currentSentence, setCurrentSentence] = useState<Phrase | null>(null);

    const initialFetchRef = useRef(false);

    const fetchSentences = useCallback(async () => {
        console.log(`Fetching more from ${skip} to ${skip + take}`);
        try {
            const data = await getFreePhrases({ skip, take, topic: selectedTopic?.value });
            setSentences((prev) => [...prev, ...data]);
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

    return { sentences, currentIndex, handleNext, handlePrevious, currentSentence, currentSentenceRef };
};

export default useFreeSentenceManagement;
