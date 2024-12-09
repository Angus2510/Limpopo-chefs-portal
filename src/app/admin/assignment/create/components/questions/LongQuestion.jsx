import React from "react";

const LongQuestion = ({ value, onChange, answer, onAnswerChange }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Long Question</h2>
      <p className="text-gray-800 mt-1">Provide a detailed answer.</p>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Enter your question detail"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Enter the correct answer"
        value={answer}
        onChange={onAnswerChange}
      />
    </div>
  );
};

export default LongQuestion;
