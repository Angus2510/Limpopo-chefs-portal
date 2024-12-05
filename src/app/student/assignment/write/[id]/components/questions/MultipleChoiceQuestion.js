import React, { useState, useEffect } from 'react';

export default function MultipleChoiceQuestion({ question, questionNumber, mark, options, value, onChange }) {
  const [selectedOption, setSelectedOption] = useState(value || null);

  const numericMark = Number(mark);
  
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
          Multiple choice question
        </span>
        <div className="mb-2">
          <span className="text-lg font-medium text-gray-900">
            {question}
          </span>
        </div>
        <form>
          {options.map((option, index) => (
            <label
              key={index}
              className={`block cursor-pointer rounded-lg px-4 py-3 mb-3 transition duration-300 ${
                selectedOption === option ? 'bg-green-600 text-white' : 'bg-white text-gray-600'
              } hover:bg-green-600 hover:text-white`}
            >
              <input
                type="radio"
                name={`answer-${questionNumber}`}
                value={option.value}
                className="mr-2"
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
              />
              {option.value}
            </label>
          ))}
        </form>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
        {numericMark} {numericMark === 1 ? 'Mark' : 'Marks'}
        </span>
      </div>
    </div>
  );
}
