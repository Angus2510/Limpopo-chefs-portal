import React, { useState, useEffect } from 'react';

export default function SingleWordQuestion({ question, questionNumber, mark, value, onChange }) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const numericMark = Number(mark);
  
  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
          Single word question
        </span>
        <p className="text-gray-800 mt-1">{question}</p>
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your answer"
            value={inputValue}
            onChange={handleInputChange}
          />
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
