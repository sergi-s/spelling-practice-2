import React from 'react';


export const DifficultySelect: React.FC<{ difficulty: number | undefined, onChange: (difficulty: number) => void }> = ({ difficulty, onChange }) => {
    const difficultyOptions = [1, 2, 3, 4, 5];

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(parseInt(event.target.value));
    };

    return (
        <div className="col-span-2 px-4 py-2 bg-white text-black rounded border-2 border-gray-300 focus:outline-none focus:border-blue-500">
            <label htmlFor="difficulty">Difficulty:</label>
            <select style={{ color: "black" }} id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
                {difficultyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
