import React from "react";

// MultipleChoiceQuestion component allows adding options, changing option text, and selecting the correct answer
const MultipleChoiceQuestion = ({ options, setOptions }) => {
  // Function to handle changes in option text (value)
  const handleOptionChange = (index, value) => {
    // Create a new options array with the updated value for the specified option
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, value: value } : option
    );
    setOptions(newOptions); // Update the options state with the modified array
  };

  // Function to handle changes to the correct answer (checkbox)
  const handleCorrectAnswerChange = (index) => {
    // Toggle the isCorrect value for the selected option, keeping the others unchanged
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index ? !option.isCorrect : option.isCorrect,
    }));
    setOptions(newOptions); // Update the options state with the modified array
  };

  // Function to add a new option with empty text and isCorrect set to false
  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: `new_${options.length}`, value: "", isCorrect: false },
    ]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
      {/* Map through the options array to render input fields for each option */}
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center mb-2">
          {/* Input field for the option's text */}
          <input
            type="text"
            placeholder="Enter option text"
            value={option.value}
            onChange={(e) => handleOptionChange(index, e.target.value)} // Update option text on change
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          {/* Checkbox to mark the option as correct */}
          <input
            type="checkbox"
            checked={option.isCorrect || false}
            onChange={() => handleCorrectAnswerChange(index)} // Toggle isCorrect on checkbox change
            className="form-checkbox h-5 w-5"
          />
        </div>
      ))}
      {/* Button to add a new option */}
      <button
        onClick={handleAddOption}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Option
      </button>
    </div>
  );
};

export default MultipleChoiceQuestion;
