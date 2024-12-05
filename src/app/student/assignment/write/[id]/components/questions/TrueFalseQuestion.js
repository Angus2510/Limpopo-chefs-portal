import React, { useState, useEffect } from 'react';

export default function TrueFalseQuestion({ question, questionNumber, mark, value, onChange }) {
  const [selectedOption, setSelectedOption] = useState(value || null);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  const numericMark = Number(mark);

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
        True or False question
        </span>
        <p className="text-gray-800 mt-1">{question}</p>
        <div className="flex mt-4">
          <button
            className={`px-6 py-2 w-full rounded-l-lg ${selectedOption === 'True' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} border border-gray-300 hover:bg-green-50`}
            onClick={() => handleOptionChange('True')}
          >
            True
          </button>
          <button
            className={`px-6 py-2 w-full rounded-r-lg ${selectedOption === 'False' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} border-t border-b border-gray-300 hover:bg-green-50`}
            onClick={() => handleOptionChange('False')}
          >
            False
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
         {numericMark} {numericMark === 1 ? 'Mark' : 'Marks'}
        </span>
      </div>
    </div>
  );
}
