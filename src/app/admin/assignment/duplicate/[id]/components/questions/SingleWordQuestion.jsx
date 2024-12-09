import React from "react";

const SingleWordQuestion = ({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Single Word Question</h2>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Enter the question text"
        value={question}
        onChange={onQuestionChange}
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

export default SingleWordQuestion;
