import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'; // Import icons for the toggle button

export const ShortcutInstructions = () => {
    // State to control visibility of the instructions
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the instructions visibility
    const toggleInstructions = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="m-2">
            <button 
                onClick={toggleInstructions} 
                className="flex items-center justify-between w-full p-2 bg-cyan-500 text-white rounded shadow ">
                {isOpen ? <RiArrowUpSLine size="24" /> : <RiArrowDownSLine size="24" />}
                <span className="font-bold">Shortcut Instructions</span>
            </button>
            {isOpen && (
                <div className="p-2 border-double border-4 border-cyan-500 text-gray rounded shadow mt-2">
                    <ul className="list-disc pl-6">
                        <li>Press <strong>1</strong> to speak the generated sentence.</li>
                        <li>Press <strong>2</strong> to fetch a new sentence.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};
