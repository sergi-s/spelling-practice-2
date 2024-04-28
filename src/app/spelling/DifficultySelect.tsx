import React from 'react';


export const DifficultySelect: React.FC<{ difficulty: number | undefined, onChange: (difficulty: number) => void }> = ({ difficulty, onChange }) => {
    const difficultyOptions = [1, 2, 3, 4, 5];

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(parseInt(event.target.value));
    };

    return (
        <div>
            <label htmlFor="difficulty">Difficulty:</label>
            <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
                {difficultyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
