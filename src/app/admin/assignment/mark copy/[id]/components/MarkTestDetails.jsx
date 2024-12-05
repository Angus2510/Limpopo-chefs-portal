"use client"

import React, { useState, useEffect } from 'react';
import { useGetResultByIdQuery, useUpdateResultByIdMutation, useUpdateModeratedMarksByIdMutation } from '@/lib/features/assignment/assignmentsResultsApiSlice';
import CommentsSection from './CommentsSection';
import TestDetailsSection from './TestDetailsSection';
import TestSection from './TestSection';
import TestModerationSection from './TestModerationSection';

function TestDetailsForm({ id, staffId}) {
  const { data: result, isLoading, isError } = useGetResultByIdQuery(id);
  const [submittedComments, setSubmittedComments] = useState([]);
  const [marks, setMarks] = useState([]); 
  const [moderatedMarks, setModeratedMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalModeratedMarks, setTotalModeratedMarks] = useState(0);
  const [maxTotalMarks, setMaxTotalMarks] = useState(0);
  const [isModerating, setIsModerating] = useState(false);
  const [updateResultById] = useUpdateResultByIdMutation();
  const [updateModeratedMarksById] = useUpdateModeratedMarksByIdMutation();
  const [showModerateButton, setShowModerateButton] = useState(false);
  const [showModeration, setShowModeration] = useState(false);

  useEffect(() => {
    if (result) {
      console.log('Fetched Result:', result); 
      setSubmittedComments(result.studentDetails.feedback || []);
      const initialMarks = result.questions.map(question => ({
        answerId: question.studentAnswer._id,
        score: question.score || 0,
        moderatedScore: question.moderatedScore || 0,
      }));
      setMarks(initialMarks);
      if (result.status === 'Moderated') {
        setModeratedMarks(initialMarks.map(mark => ({
          answerId: mark.answerId,
          score: mark.moderatedScore,
        })));
        setTotalModeratedMarks(initialMarks.reduce((acc, curr) => acc + curr.moderatedScore, 0));
        setIsModerating(true);
      } else {
        setModeratedMarks(initialMarks);
        setTotalModeratedMarks(initialMarks.reduce((acc, curr) => acc + curr.score, 0));
      }
      setTotalMarks(initialMarks.reduce((acc, curr) => acc + curr.score, 0));
      setMaxTotalMarks(result.questions.reduce((acc, question) => acc + (parseFloat(question.mark) || 0), 0));
    }
  }, [result]);

  const handleMarksChange = (index, value, isModerated = false) => {
    const newMarks = isModerated ? [...moderatedMarks] : [...marks];
    newMarks[index] = {
      ...newMarks[index],
      score: parseFloat(value) || 0, 
    };
    if (isModerated) {
      setModeratedMarks(newMarks);
      setTotalModeratedMarks(newMarks.reduce((acc, curr) => acc + curr.score, 0));
    } else {
      setMarks(newMarks);
      setTotalMarks(newMarks.reduce((acc, curr) => acc + curr.score, 0));
    }
  };

  const handleSubmitMarks = async () => {
    try {
      const updatedAnswers = marks.map((mark) => ({
        answerId: mark.answerId,
        score: mark.score,
      }));

      const payload = {
        answers: updatedAnswers,
      };

      console.log('Submitting updated marks with payload:', payload);

      await updateResultById({ id, data: payload }).unwrap();
      alert('Marks submitted successfully!');
    } catch (err) {
      console.error('Failed to submit marks:', err);
    }
  };

  const handleSubmitModeratedMarks = async () => {
    try {
      const updatedModeratedMarks = moderatedMarks.map((mark) => ({
        answerId: mark.answerId,
        moderatedScore: mark.score,
      }));

      const payload = {
        answers: updatedModeratedMarks,
        lecturerId:staffId,
        resultsId: id,
      };

      console.log('Submitting moderated marks with payload:', payload);

      await updateModeratedMarksById({ id, data: payload }).unwrap();
      alert('Moderated marks submitted successfully!');
    } catch (err) {
      console.error('Failed to submit moderated marks:', err);
    }
  };

  const handleModerateButtonClick = () => {
    setShowModeration(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading assignment result</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <TestDetailsSection result={result} />

     {result.status !=="Moderated" && !showModeration && (
        <TestSection
          result={result}
          marks={marks}
          totalMarks={totalMarks}
          maxTotalMarks={maxTotalMarks}
          handleMarksChange={handleMarksChange}
          handleSubmitMarks={handleSubmitMarks}
        />

        
      )}

    {result.status !== "Moderated" && !showModeration && result.status === "Marked" && (
    <div className="mt-8">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModerateButtonClick}
      >
        Moderate
      </button>
    </div>
      )}

      {showModeration || result.status === "Moderated" ?(
        <TestModerationSection
          result={result}
          marks={marks}
          moderatedMarks={moderatedMarks}
          totalMarks={totalMarks}
          totalModeratedMarks={totalModeratedMarks}
          maxTotalMarks={maxTotalMarks}
          isModerating={isModerating}
          handleMarksChange={handleMarksChange}
          handleSubmitMarks={handleSubmitMarks}
          handleSubmitModeratedMarks={handleSubmitModeratedMarks}
          setIsModerating={setIsModerating}
          id={id}
        />
      ) : null}

      <CommentsSection
        id={id}
        submittedComments={submittedComments}
        setSubmittedComments={setSubmittedComments}
      />
    </div>
  );
}

export default TestDetailsForm;
