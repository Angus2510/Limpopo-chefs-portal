import React from 'react';

const MultipleChoiceQuestion = ({ options, setOptions,}) => {
    const handleOptionChange = (index, value) => {
        const newOptions = options.map((option, i) => (
            i === index ? { ...option, value: value } : option
        ));
        setOptions(newOptions);
    };

    const handleCorrectAnswerChange = (index) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index ? !option.isCorrect : option.isCorrect
        }));
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, { id: `new_${options.length}`, value: '', isCorrect: false }]);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
            {options.map((option, index) => (
                <div key={option.id} className="flex items-center mb-2">
                    <input
                        type="text"
                        placeholder="Enter option text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                    />
                    <input
                        type="checkbox"
                        checked={option.isCorrect || false}
                        onChange={() => handleCorrectAnswerChange(index)}
                        className="form-checkbox h-5 w-5"
                    />
                </div>
            ))}
            <button onClick={handleAddOption} className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Option
            </button>
        </div>
    );
};

export default MultipleChoiceQuestion;
