import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { type TopicOption } from 'types/types';
import useTopicsSelect from '../../hooks/useTopicsSelect';
import type { CSSObject } from 'styled-components';

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        menu: (provided: CSSObject) => ({
            ...provided,
            zIndex: 9999
        }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        menuList: (provided: CSSObject) => ({
            ...provided,
            maxHeight: '400px' // Increase the height of the dropdown list
        })
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container m-2 p-1">
            <CreatableSelect
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                onCreateOption={handleSelectCreate}
                placeholder="Search and select or create a topic..."
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                styles={customStyles}
            />
            {selectedOption && <div>You selected: {selectedOption.label}</div>}
        </div>
    );
};
