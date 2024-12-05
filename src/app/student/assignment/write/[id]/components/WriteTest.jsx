"use client";
import React, { useState, useEffect } from 'react';
import AssignmentView from './AssignmentView';
import TestContainer from './TestContainer';
import { useRouter } from 'next/navigation';

const WriteTest = ({ id, studentId }) => {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [assignmentData, setAssignmentData] = useState(null);
  const [duration, setDuration] = useState(null);
  const [type, setType] = useState('');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const handleStartTest = (assignment, duration, type, questions) => {
    setAssignmentData({ ...assignment, duration });
    setDuration(duration);
    setQuestions(questions); 
    setType(type);
    setIsTestStarted(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isTestStarted && !isTestSubmitted) { 
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your test progress will be lost and test will be terminated.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTestStarted, isTestSubmitted]); 

  return (
    <div className="absolute inset-0 bg-gray-200">
      <div className="mx-auto">
        {!isTestStarted ? (
          <AssignmentView
            id={id}
            studentId={studentId}
            onStartTest={handleStartTest}
          />
        ) : (
          <TestContainer
            id={id}
            assignment={assignmentData}
            duration={duration}
            studentId={studentId}
            questions={questions}
            type={type}
            setIsTestSubmitted={setIsTestSubmitted} 
          />
        )}
      </div>
    </div>
  );
};

export default WriteTest;
