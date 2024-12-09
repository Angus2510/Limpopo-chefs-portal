import React from "react";

// MatchQuestion component allows adding and modifying pairs of values
const MatchQuestion = ({ options, setOptions }) => {
  // Function to add a new pair (columnA and columnB) to the options array
  const handleAddPair = () => {
    const newPair = { columnA: "", columnB: "" }; // Initialize an empty pair
    setOptions([...options, newPair]); // Add the new pair to the existing options
  };

  // Function to handle changes to either columnA or columnB for a specific pair
  const handlePairChange = (index, key, value) => {
    // Create a new array where only the updated pair is modified
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, [key]: value } : option
    );
    setOptions(newOptions); // Update the options state with the modified pair
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
      {/* Map over the options array and render input fields for each pair */}
      {options.map((option, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          {/* Input field for columnA */}
          <input
            type="text"
            value={option.columnA}
            onChange={(e) => handlePairChange(index, "columnA", e.target.value)} // Update columnA on change
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
            placeholder="Enter Column A text"
          />
          {/* Input field for columnB */}
          <input
            type="text"
            value={option.columnB}
            onChange={(e) => handlePairChange(index, "columnB", e.target.value)} // Update columnB on change
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Column B text"
          />
        </div>
      ))}
      {/* Button to add a new pair */}
      <button
        onClick={handleAddPair} // Trigger handleAddPair function when clicked
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Pair
      </button>
    </div>
  );
};

export default MatchQuestion;
