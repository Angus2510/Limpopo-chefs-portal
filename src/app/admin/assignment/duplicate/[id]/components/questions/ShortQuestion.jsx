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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Enter your question"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ShortQuestion;
