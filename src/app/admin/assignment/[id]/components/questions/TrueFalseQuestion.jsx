import React from "react";

// TrueFalseQuestion component renders two buttons (True/False) for the user to select an answer.
const TrueFalseQuestion = ({ answer, onAnswerChange }) => {
  return (
    <div className="mb-4">
      {/* Title for the question */}
      <h2 className="text-xl font-semibold">True/False Question</h2>

      {/* Container for True/False buttons */}
      <div className="flex mt-4 space-x-4">
        {/* 'True' button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "True"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => onAnswerChange("True")} // Calls onAnswerChange with 'True' when clicked
        >
          True
        </button>

        {/* 'False' button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "False"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => onAnswerChange("False")} // Calls onAnswerChange with 'False' when clicked
        >
          False
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
