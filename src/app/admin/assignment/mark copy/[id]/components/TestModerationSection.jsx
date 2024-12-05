import React, { useState, useEffect } from 'react';
import Card from '@/components/card/index';
import { useGetModerationsByResultIdQuery } from '@/lib/features/assignment/assignmentsResultsApiSlice';

const TestModerationSection = ({
  moderationRecords = [], 
  result,
  marks,
  moderatedMarks,
  totalMarks,
  totalModeratedMarks,
  maxTotalMarks,
  handleMarksChange,
  handleModeratedMarksChange,
  handleSubmitMarks,
  handleSubmitModeratedMarks,
  id,
}) => {
  const [activeRecordIndex, setActiveRecordIndex] = useState(0); // State to track active moderation record index
  const [isAddingNewModeration, setIsAddingNewModeration] = useState(false); // State to toggle adding new moderation entry


  const { data: moderationData=[], isLoading, isError } = useGetModerationsByResultIdQuery(id);

  console.log(moderationData)

  useEffect(() => {
    // If no moderation data is present, set the state to add a new moderation entry by default
    if (!isLoading && !isError && moderationData.length === 0) {
      setIsAddingNewModeration(true);
    }
  }, [isLoading, isError, moderationData]);


  const handleTabChange = (index) => {
    setActiveRecordIndex(index);
    setIsAddingNewModeration(false); // Reset to false when switching tabs
  };

  const handleAddNewModeration = () => {
    setIsAddingNewModeration(true);
  };

  const renderAnswer = (answer) => {
    if (typeof answer === 'object' && answer !== null) {
      return answer.value || JSON.stringify(answer);
    }
    return answer;
  };

  const renderCorrectAnswer = (correctAnswer, type) => {
    if (type === 'MultipleChoice') {
      return correctAnswer.join(', ');
    }
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.map(answer => answer.columnB).join(', ');
    }
    return correctAnswer;
  };

  const renderMatchAnswer = (matchAnswers) => {
    return matchAnswers.map(match => match.pairTwo).join(', ');
  };

  const handleSubmission = () => {

    const moderatedMarksData = moderatedMarks.map((mark, index) => ({
      answerId: marks[index].answerId, 
      moderatedScore: mark.score,
    }));
    console.log(moderatedMarksData )

    // Call the submit function from props
    handleSubmitModeratedMarks(moderatedMarksData);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };


console.log(result)
  return (
    <Card className="p-6">
      {/* Tab selector for different moderation records and add new */}
      <div className="mb-4">
        {moderationData.map((record, index) => (
          <button
            key={index}
            className={`mr-4 py-2 px-4 border rounded ${index === activeRecordIndex ? 'bg-gray-300' : 'bg-gray-100'}`}
            onClick={() => handleTabChange(index)}
          >
            Record {index + 1}
          </button>
        ))}
        <button
          className={`py-2 px-4 border rounded ${isAddingNewModeration ? 'bg-gray-300' : 'bg-gray-100'}`}
          onClick={handleAddNewModeration}
        >
          + New
        </button>
      </div>

      {/* Display moderation details */}
      {isAddingNewModeration ? (
        <div className="mb-4">
          <h2>New Moderation Entry</h2>
        </div>
      ) : (
        <div>
          <h2>Moderation Record {activeRecordIndex + 1}</h2>
            <div className="mb-4">
              <p>Moderated By: {moderationData[activeRecordIndex]?.moderatedBy}</p>
              <p>Date: {formatDate(moderationData[activeRecordIndex]?.createdAt)}</p>
            </div>
        </div>
      )}

      {result && (
        <div>
          <h2 className="text-lg font-semibold">Test Section</h2>
          {result.questions.map((question, index) => (
            <div key={index}>
              <h2 className="text-lg font-semibold">Question {index + 1}</h2>
              <p className="text-gray-800">{question.text}</p>
              <p className="text-gray-600">Correct Answer: {renderCorrectAnswer(question.correctAnswer, question.type) || 'N/A'}</p>
              <p className="text-gray-600">Student Answer: {question.type === 'Match' ? renderMatchAnswer(question.matchAnswers) : renderAnswer(question.studentAnswer.value)}</p>
              {question.type === 'MultipleChoice' && (
                <div className="mb-4">
                  {question.options.map((option, idx) => (
                    <div key={idx} className={`px-4 py-2 rounded-lg ${option.value === question.studentAnswer.value ? (question.correctAnswer.includes(option.value) ? 'bg-green-200' : 'bg-red-200') : 'bg-gray-200'}`}>
                      {option.value} {question.correctAnswer.includes(option.value) ? '(Correct)' : ''}
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'Match' && (
                <div>
                  <h3 className="text-md font-semibold">Correct Match:</h3>
                  {question.options.map((pair, idx) => (
                    <div key={idx} className="text-sm">
                      {pair?.columnA?.startsWith('http') ? (
                        <img src={pair.columnA} alt="Column A" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      ) : (
                        pair.columnA
                      )} matches with {pair.columnB}
                    </div>
                  ))}
                  <h3 className="text-md font-semibold mt-2">Student Match:</h3>
                  {question.matchAnswers.map((match, idx) => (
                    <div key={idx} className="text-sm">
                      {match?.pairOne?.startsWith('http') ? (
                        <img src={match.pairOne} alt="Pair One" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      ) : (
                        match.pairOne
                      )} matches with {match.pairTwo}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center mt-2">
                <label className="mr-2">Original {parseFloat(question.mark) === 1 ? 'Mark' : 'Marks'}:</label>
                <input
                  type="number"
                  value={marks[index]?.score || 0}
                  onChange={(e) => handleMarksChange(index, e.target.value)}
                  className="w-16 border rounded-md py-1 px-2"
                  disabled={true}
                />
                <span className="ml-2">/ {parseFloat(question.mark)}</span>
              </div>

              {isAddingNewModeration && (
              <div className="flex items-center mt-2">
                  <label htmlFor={`moderated-marks-${index}`} className="mr-2">Moderated  {parseFloat(question.mark) === 1 ? 'Mark' : 'Marks'}:</label>
                  <input
                    type="number"
                    id={`moderated-marks-${index}`}
                    value={moderatedMarks[index]?.score || 0}
                    onChange={(e) => handleMarksChange(index, e.target.value, true)}
                    className="w-16 border rounded-md py-1 px-2"
                    disabled={!isAddingNewModeration}
                  />
                  <span className="ml-2">/ {parseFloat(question.mark)}</span>
                </div>  
                 )}
                {!isAddingNewModeration && (
                <div className="flex items-center mt-2">
                  <label htmlFor={`moderated-marks-${index}`} className="mr-2">Moderated Marks:</label>
                  <input
                    type="number"
                    id={`moderated-marks-${index}`}
                    value={(moderationData[activeRecordIndex]?.moderationEntries[index]?.answer.moderatedScore) || 0}
                    onChange={(e) => handleMarksChange(index, e.target.value, true)}
                    className="w-16 border rounded-md py-1 px-2"
                    disabled={!isAddingNewModeration}
                  />
                  <span className="ml-2">/ {parseFloat(question.mark)}</span>
                </div>    
                 )}
            </div>
          ))}
        </div>
      )}

      {/* Display total marks and total moderated marks */}
      <div className="text-xl font-semibold">
        <p>Total Marks: {totalMarks} / {maxTotalMarks}</p>
        <p>Total Moderated Marks: {totalModeratedMarks}/ {maxTotalMarks}</p>
      </div>

      {/* Display submit button for pending status */}
      {isAddingNewModeration && (
        <div className="mt-8">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
             onClick={handleSubmission}
          >
            Submit Modertaion
          </button>
        </div>
      )}
    </Card>
  );
};

export default TestModerationSection;
