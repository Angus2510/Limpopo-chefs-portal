import React from 'react';

const TrueFalseQuestion = ({ answer, onAnswerChange }) => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold">True/False Question</h2>
            <div className="flex mt-4 space-x-4">
                <button
                    className={`px-4 py-2 rounded-lg font-medium ${answer === 'True' ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
                    onClick={() => onAnswerChange('True')}
                >
                    True
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-medium ${answer === 'False' ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
                    onClick={() => onAnswerChange('False')}
                >
                    False
                </button>
            </div>
        </div>
    );
}

export default TrueFalseQuestion;
