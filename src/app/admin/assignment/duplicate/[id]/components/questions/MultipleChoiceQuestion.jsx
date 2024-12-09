import React from "react";

const MultipleChoiceQuestion = ({ options, setOptions }) => {
  // Function to handle changes to the value of an option (text input)
  const handleOptionChange = (index, value) => {
    // Create a new options array where the changed option value is updated
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, value: value } : option
    );
    setOptions(newOptions); // Update the options state
  };

  // Function to toggle the "isCorrect" flag for the selected option
  const handleCorrectAnswerChange = (index) => {
    // Create a new options array and toggle the "isCorrect" flag for the selected option
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index ? !option.isCorrect : option.isCorrect,
    }));
    setOptions(newOptions); // Update the options state
  };

  // Function to add a new empty option
  const handleAddOption = () => {
    // Add a new option object with an empty value and isCorrect set to false
    setOptions([
      ...options,
      { id: `new_${options.length}`, value: "", isCorrect: false },
    ]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
      {/* Loop through the options array and render a text input and checkbox for each option */}
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center mb-2">
          {/* Text input for entering the option text */}
          <input
            type="text"
            placeholder="Enter option text"
            value={option.value} // Display the current value of the option
            onChange={(e) => handleOptionChange(index, e.target.value)} // Handle text input change
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          {/* Checkbox to mark the option as the correct answer */}
          <input
            type="checkbox"
            checked={option.isCorrect || false} // Check the box if this option is correct
            onChange={() => handleCorrectAnswerChange(index)} // Toggle correctness
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

export default MultipleChoiceQuestion;
