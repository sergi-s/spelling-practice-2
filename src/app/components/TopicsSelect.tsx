import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { type TopicOption } from 'types/types';
import useTopicsSelect from '../../hooks/useTopicsSelect';

export const TopicsSelect = ({ authed, onOptionChange }: { authed: boolean, onOptionChange: (selectedValue: TopicOption) => void; }) => {

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
        if (!authed) alert("You are adding a new Topic, Login to add more")
        onOptionChange({ value: inputValue, label: inputValue });
    };

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            zIndex: 9999 // High z-index to ensure overlay - Ensures most other actions cannot be performed while trying to use topic feature
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '400px' // Increase the height of the dropdown list
        })
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container m-2 p-1">
            <CreatableSelect
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                onCreateOption={handleSelectCreate}
                placeholder="Search and select or create a topic..."
                styles={customStyles} // Apply custom styles here
            />
            {selectedOption && <div>You selected: {selectedOption.label}</div>}
        </div>
    );
};
