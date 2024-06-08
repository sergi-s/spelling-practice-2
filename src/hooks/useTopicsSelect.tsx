import { useState, useEffect } from 'react';
import { getAllTopics } from '../app/api/topics/actions';
import { type TopicOption } from 'types/types';

const fetchTopics = async (): Promise<TopicOption[]> => {
    const topics = await getAllTopics();
    const topicsOptions: TopicOption[] = topics.map(topic => ({ value: topic, label: topic }));
    return topicsOptions;
};

const useTopicsSelect = () => {
    const [options, setOptions] = useState<TopicOption[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<TopicOption | null>(null);

    useEffect(() => {
        const loadTopics = async () => {
            setIsLoading(true);
            try {
                const topicsOptions = await fetchTopics();
                setOptions(topicsOptions);
                setError(null);
            } catch (err) {
                setError(err as Error);
                setOptions(null);
            } finally {
                setIsLoading(false);
            }
        };

        void loadTopics();
    }, []);

    const handleChange = (selectedValue: TopicOption | null) => {
        setSelectedOption(selectedValue);
    };

    const handleCreate = (inputValue: string) => {
        const newOption: TopicOption = { value: inputValue, label: inputValue };
        setSelectedOption(newOption);
    };

    return {
        options,
        error,
        isLoading,
        selectedOption,
        handleChange,
        handleCreate
    };
};

export default useTopicsSelect;
