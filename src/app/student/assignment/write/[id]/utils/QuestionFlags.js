import React from 'react';

const QuestionFlags = ({ questionId, flag, onFlagChange }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div>
        <label>
          <input
            type="radio"
            name={`flag_${questionId}`}
            value="red"
            checked={flag === 'red'}
            onChange={() => onFlagChange(questionId, 'red')}
          /> Red Flag
        </label>
        <label className="ml-2">
          <input
            type="radio"
            name={`flag_${questionId}`}
            value="yellow"
            checked={flag === 'yellow'}
            onChange={() => onFlagChange(questionId, 'yellow')}
          /> Yellow Flag
        </label>
      </div>
      <div>
        <button
          onClick={() => onFlagChange(questionId, null)}
          className="bg-gray-200 px-2 py-1 rounded"
        >
          Clear Flag
        </button>
      </div>
    </div>
  );
};

export default QuestionFlags;
