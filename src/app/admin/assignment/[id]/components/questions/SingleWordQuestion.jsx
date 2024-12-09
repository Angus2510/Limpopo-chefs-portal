import React from "react";

// SingleWordQuestion component renders input fields for the question text and the correct answer.
const SingleWordQuestion = ({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
}) => {
  return (
    <div className="mb-4">
      {/* Title for the question */}
      <h2 className="text-xl font-semibold">Single Word Question</h2>

      {/* Input field for the question text */}
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter the question text"
        value={question} // The current value of the question input
        onChange={onQuestionChange} // Handler for changes to the question text
      />

      {/* Input field for the correct answer */}
      <input
        type="text"
        className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter the correct answer"
        value={answer} // The current value of the answer input
        onChange={onAnswerChange} // Handler for changes to the answer text
      />
    </div>
  );
};

export default SingleWordQuestion;
