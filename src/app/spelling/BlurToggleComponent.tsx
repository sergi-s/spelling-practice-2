import React, { useState } from 'react';

// Props type for the component
interface BlurToggleComponentProps {
  words: string[];
}

const BlurToggleComponent: React.FC<BlurToggleComponentProps> = ({ words }) => {
  const [isBlurred, setIsBlurred] = useState(true);

  // Toggle the blur state
  const toggleBlur = () => setIsBlurred(!isBlurred);

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full flex justify-center">
        <button 
          onClick={toggleBlur} 
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isBlurred ? 'Show Misspelled Words' : 'Hide Misspelled Words'}
        </button>
      </div>
      <div className="flex justify-center w-full">
        <div className="p-2 bg-gray-100 rounded-lg border border-gray-300 max-w-full flex flex-wrap justify-center gap-2">
          {words.map((word, index) => (
            <span key={index} className={`inline-block ${isBlurred ? 'blur-sm' : ''}`}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlurToggleComponent;
