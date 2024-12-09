import React from "react";

// Add props to handle value and onChange to make this component controlled
const ShortQuestion = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Question</h2>
      <p className="text-gray-800 mt-1">Short Answer Type</p>
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question"
          value={value} // Controlled input
          onChange={(e) => onChange(e.target.value)} // Directly pass the value to the parent's onChange handler
        />
      </div>
    </div>
  );
};

export default ShortQuestion;
