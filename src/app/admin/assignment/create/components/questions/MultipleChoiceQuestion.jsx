import React from "react";

// Functional component for creating and managing multiple choice question options
const MultipleChoiceQuestion = ({ options, setOptions }) => {
  // Function to handle changes in option text (value)
  const handleOptionChange = (index, value) => {
    // Create a new options array where the specified option's value is updated
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, value: value } : option
    );
    // Update the options state with the new options array
    setOptions(newOptions);
  };

  // Function to toggle the correct answer checkbox for a given option
  const handleCorrectAnswerChange = (index) => {
    // Create a new options array where the correct answer status is toggled for the selected option
    const newOptions = options.map((option, i) => ({
      ...option,
      // If it's the selected index, toggle the `isCorrect` value
      isCorrect: i === index ? !option.isCorrect : option.isCorrect,
    }));
    // Update the options state with the new options array
    setOptions(newOptions);
  };

  // Function to add a new option to the list
  const handleAddOption = () => {
    // Add a new option with an empty value and `isCorrect` set to false
    setOptions([
      ...options,
      { id: `new_${options.length}`, value: "", isCorrect: false },
    ]);
  };

  return (
    // Container div for styling the multiple choice question options
    <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
      {/* Render each option with input fields for text and checkbox for correct answer */}
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center mb-2">
          {/* Input field for option text */}
          <input
            type="text"
            placeholder="Enter option text"
            value={option.value}
            onChange={(e) => handleOptionChange(index, e.target.value)} // Handle text change
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          {/* Checkbox to mark option as correct */}
          <input
            type="checkbox"
            checked={option.isCorrect || false} // Ensure the checkbox is checked if `isCorrect` is true
            onChange={() => handleCorrectAnswerChange(index)} // Handle correct answer toggle
            className="form-checkbox h-5 w-5"
          />
        </div>
      ))}
      {/* Button to add a new option */}
      <button
        onClick={handleAddOption}
        className="bg-brand-500 text-white px-4 py-2 rounded"
      >
        Add Option
      </button>
    </div>
  );
};

export default MultipleChoiceQuestion; // Export the component to be used in other parts of the application
