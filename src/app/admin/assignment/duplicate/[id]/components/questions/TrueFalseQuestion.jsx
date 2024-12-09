import React from "react";

const TrueFalseQuestion = ({ answer, onAnswerChange }) => {
  return (
    <div className="mb-4">
      {/* Display the title of the question */}
      <h2 className="text-xl font-semibold">True/False Question</h2>

      {/* Create a button group for True and False answers */}
      <div className="flex mt-4 space-x-4">
        {/* Button for selecting "True" */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "True"
              ? "bg-brand-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          // Apply the appropriate styles based on whether the answer is "True"
          onClick={() => onAnswerChange("True")} // Call the function to handle answer change
        >
          True
        </button>

        {/* Button for selecting "False" */}
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            answer === "False"
              ? "bg-brand-600 text-white"
              : "bg-gray-300 text-black"
          }`}
          // Apply the appropriate styles based on whether the answer is "False"
          onClick={() => onAnswerChange("False")} // Call the function to handle answer change
        >
          False
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
