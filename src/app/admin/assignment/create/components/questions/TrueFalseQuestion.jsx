import React from "react";

// Functional component to render a True/False question with buttons
const TrueFalseQuestion = ({ answer, onAnswerChange }) => {
  return (
    <div className="mb-4">
      {/* Title for the question */}
      <h2 className="text-xl font-semibold">True/False Question</h2>

      {/* Container for the True and False buttons with some margin at the top */}
      <div className="flex mt-4 space-x-4">
        {/* True button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "True"
              ? "bg-brand-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => onAnswerChange("True")} // Update answer to 'True' when clicked
        >
          True
        </button>

        {/* False button */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "False"
              ? "bg-brand-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => onAnswerChange("False")} // Update answer to 'False' when clicked
        >
          False
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion; // Export the component to be used elsewhere in the application
