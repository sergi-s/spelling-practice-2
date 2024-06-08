import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { type TopicOption } from 'types/types';
import useTopicsSelect from '../../hooks/useTopicsSelect';

export const TopicsSelect = ({ onOptionChange }: { onOptionChange: (selectedValue: TopicOption) => void; }) => {
    const {
        options,
        error,
        isLoading,
        selectedOption,
        handleChange,
        handleCreate
    } = useTopicsSelect();

    const handleSelectChange = (selectedValue: TopicOption | null) => {
        handleChange(selectedValue);
        if (selectedValue) {
            onOptionChange(selectedValue);
        }
    };

    const handleSelectCreate = (inputValue: string) => {
        // handleCreate(inputValue);
        alert("You are adding a new Topic, Subscribe to add more")
        onOptionChange({ value: inputValue, label: inputValue });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container m-2 p-2">
            <CreatableSelect
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                onCreateOption={handleSelectCreate}
                placeholder="Search and select or create a topic..."
            />
            {selectedOption && <div>You selected: {selectedOption.label}</div>}
        </div>
    );
};
