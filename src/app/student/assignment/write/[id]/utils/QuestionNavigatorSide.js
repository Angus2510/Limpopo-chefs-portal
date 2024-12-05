import React from 'react';

const QuestionNavigatorSide = ({ questions, answers, flags, currentQuestionIndex, setCurrentQuestionIndex, handleSaveAnswer }) => {
  const getQuestionButtonClass = (questionId, index) => {
    const answerData = answers[questionId] || {};
    const answer = answerData.answer || '';
    const matchAnswers = answerData.matchAnswers || [];
    const flag = flags[questionId];
    let bgColor = 'bg-gray-300';
    
    if (answer || matchAnswers.some(match => match.pairTwo)) bgColor = 'bg-black';
    if (answer) bgColor = 'bg-black';
    if (flag === 'red') bgColor = 'bg-red-500 text-white';
    if (flag === 'yellow') bgColor = 'bg-yellow-500 text-white';

    return `w-10 h-10 m-1 rounded-full ${bgColor} ${currentQuestionIndex === index ? 'border-2 border-green-500' : ''}`;
  };

  const handleQuestionClick = async (index) => {
    const currentQuestion = questions[currentQuestionIndex];
    const { answer, matchAnswers } = answers[currentQuestion._id] || {};
    await handleSaveAnswer(currentQuestion._id, answer, matchAnswers);
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="fixed left-4 top-4 bottom-4 w-20 bg-gray-100 p-2 flex flex-col items-center overflow-y-auto rounded-lg shadow-lg">
      {questions.map((question, index) => (
        <button
          key={question._id}
          className={getQuestionButtonClass(question._id, index)}
          onClick={() => handleQuestionClick(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigatorSide;
