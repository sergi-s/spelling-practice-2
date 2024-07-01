import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { type TopicOption } from 'types/types';
import useTopicsSelect from '../../hooks/useTopicsSelect';
import { useSession } from 'next-auth/react';

export const TopicsSelect = ({ onOptionChange }: { onOptionChange: (selectedValue: TopicOption) => void; }) => {

    const { status } = useSession()
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
        if (status != "authenticated") alert("You are adding a new Topic, Login to add more")
        onOptionChange({ value: inputValue, label: inputValue });
    };

    const customStyles = {
        menu: (provided: unknown[]) => ({ ...provided, zIndex: 9999 }),
        menuList: (provided: unknown[]) => ({ ...provided, maxHeight: '400px' })
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
                options={options!}
                value={selectedOption}
                onChange={handleSelectChange}
                onCreateOption={handleSelectCreate}
                placeholder="Search and select or create a topic..."
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                styles={customStyles}
            />
            {selectedOption && <div>You selected: {selectedOption.label}</div>}
        </div>
    );
};
