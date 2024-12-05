"use client";
import React, { useState, useEffect , useRef} from 'react';
import { useRouter } from 'next/navigation';
import LongAnswerQuestion from './questions/LongAnswerQuestion';
import MatchingQuestion from './questions/MatchingQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import ShortAnswerQuestion from './questions/ShortAnswerQuestion';
import SingleWordQuestion from './questions/SingleWordAnswerQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import QuestionNavigator from '../utils/navigation';

import QuestionNavigatorSide from '../utils/QuestionNavigatorSide';
import QuestionFlags from '../utils/QuestionFlags'; 

import NetworkIndicator from './NetworkIndicator';
import { useSubmitAnswerMutation, useSubmitAssignmentMutation, useTerminateAssignmentMutation } from '@/lib/features/assignment/studentAssignmentsApiSlice';
import WaitingForNetwork from './WaitingForNetwork';
import WaitingForSubmission from './WaitingForSubmission';
import WaitingForSubmissionTermination from './WaitingForSubmissionTermination';

const Modal = ({ isOpen, onClose, onConfirm, type, unanswered }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Confirm Submission</h2>
        {unanswered ? 'There are unanswered questions. Are you sure you want to submit?' : `Are you sure you want to submit this ${type.toLowerCase()}?`}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TestContainer({ id, duration, studentId, type, questions, setIsTestSubmitted }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [failedSubmissions, setFailedSubmissions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCheating, setIsCheating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unanswered, setUnanswered] = useState(false);

  const [flags, setFlags] = useState({});
  const blurTimeoutRef = useRef(null);

  const [submitAnswer] = useSubmitAnswerMutation();
  const [submitAssignment, { isLoading: isSubmitting, isSuccess: submitSuccess, isError: submitError, error: submitErrorMsg }] = useSubmitAssignmentMutation();
  const [terminateAssignment, { isLoading: isTerminateing, isSuccess: terminateSuccess, isError: terminateError, error: terminateErrorMsg }] = useTerminateAssignmentMutation();

  const [isWaitingForNetwork, setIsWaitingForNetwork] = useState(false);
  const [isWaitingForSubmission, setIsWaitingForSubmission] = useState(false);
  const [isWaitingForTerminatin, setIsWaitingForTerminatin] = useState(false);

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem(`answers_${studentId}_${id}`)) || {};
    setAnswers(storedAnswers);
    const storedFailedSubmissions = JSON.parse(localStorage.getItem(`failed_submissions_${studentId}_${id}`)) || [];
    setFailedSubmissions(storedFailedSubmissions);

    const storedFlags = JSON.parse(localStorage.getItem(`flags_${studentId}_${id}`)) || {};
    setFlags(storedFlags);
  }, [studentId, id]);

  useEffect(() => {
    localStorage.setItem(`answers_${studentId}_${id}`, JSON.stringify(answers));
    localStorage.setItem(`failed_submissions_${studentId}_${id}`, JSON.stringify(failedSubmissions));
    localStorage.setItem(`flags_${studentId}_${id}`, JSON.stringify(flags));
    console.log(`Saved answers and failed submissions in local storage for assignment: ${id}`, { answers, failedSubmissions });
  }, [answers, failedSubmissions, studentId, id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else {
        console.log('Time is up. Submitting the test.');
        handleAutomaticSubmit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);


  useEffect(() => {
    const handleWindowBlur = () => {
      if (type === 'Test') {
        blurTimeoutRef.current = setTimeout(() => {
          setIsCheating(true);
          console.log('Window lost focus. Submitting the test.');
          handleTerminateSubmit();
        }, 5000); 
      }
    };

    const handleWindowFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [type]);


  const handleAnswerChange = (questionId, answer, matchAnswers = []) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { answer, matchAnswers },
    }));
  };

  const handleSaveAnswer = async (questionId, answer, matchAnswers = []) => {
    try {
      console.log('Submitting answer test:', { assignmentId: id, studentId, questionId, answer, matchAnswers });
       submitAnswer({
        assignmentId: id, 
        studentId,
        questionId,
        answer,
        matchAnswers,
      }).unwrap();
      console.log('Answer submitted successfully');
    } catch (err) {
      console.error('Failed to submit answer', err);
      setFailedSubmissions((prevFailed) => [...prevFailed, { questionId, answer, matchAnswers }]);
    }
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const { answer, matchAnswers } = answers[currentQuestion._id] || {};
    handleSaveAnswer(currentQuestion._id, answer, matchAnswers);
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handleBack = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const { answer, matchAnswers } = answers[currentQuestion._id] || {};
    handleSaveAnswer(currentQuestion._id, answer, matchAnswers);
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleFlagChange = (questionId, flagColor) => {
    setFlags((prevFlags) => ({
      ...prevFlags,
      [questionId]: flagColor,
    }));
  };

  const getAnswerForQuestion = (questionId) => {
    return answers[questionId]?.answer || '';
  };

  const getMatchAnswersForQuestion = (questionId) => {
    return answers[questionId]?.matchAnswers || [];
  };

  const renderQuestion = (question, questionNumber) => {
    const answer = getAnswerForQuestion(question._id);
    const matchAnswers = getMatchAnswersForQuestion(question._id);

    return (
      <div key={question._id} className="mb-4">
        <QuestionFlags
          questionId={question._id}
          flag={flags[question._id]}
          onFlagChange={handleFlagChange}
        />
        {renderQuestionType(question, questionNumber, answer, matchAnswers)}
      </div>
    );
  };

  const renderQuestionType = (question, questionNumber) => {
    const answer = getAnswerForQuestion(question._id);
    const matchAnswers = getMatchAnswersForQuestion(question._id);

    switch (question.type) {
      case 'Long':
        return (
          <LongAnswerQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            value={answer}
            onChange={(value) => handleAnswerChange(question._id, value)}
          />
        );
      case 'Match':
        return (
          <MatchingQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            options={question.options}
            value={matchAnswers}
            onChange={(newAnswers) => handleAnswerChange(question._id, answer, newAnswers)}
          />
        );
      case 'MultipleChoice':
        return (
          <MultipleChoiceQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            options={question.options}
            value={answer}
            onChange={(value) => handleAnswerChange(question._id, value)}
          />
        );
      case 'Short':
        return (
          <ShortAnswerQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            value={answer}
            onChange={(value) => handleAnswerChange(question._id, value)}
          />
        );
      case 'SingleWord':
        return (
          <SingleWordQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            value={answer}
            onChange={(value) => handleAnswerChange(question._id, value)}
          />
        );
      case 'TrueFalse':
        return (
          <TrueFalseQuestion
            key={question._id}
            question={question.text}
            questionNumber={questionNumber}
            mark={question.mark}
            value={answer}
            onChange={(value) => handleAnswerChange(question._id, value)}
          />
        );
      default:
        return null;
    }
  };


  const handleFinalSubmit = async () => {
    const unanswered = questions.some(q => !answers[q._id]);
    setUnanswered(unanswered);
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!navigator.onLine) {
      setIsWaitingForNetwork(true);
    } else {
    try {
      await submitAssignment({
        assignmentId: id,
        studentId,
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          answer: answers[questionId].answer,
          matchAnswers: answers[questionId].matchAnswers,
        })),
      }).unwrap();
      console.log('All answers submitted successfully');
      setIsTestSubmitted(true);
      router.push('/student/assignment/test-successfully-submitted');
    } catch (err) {
      console.error('Failed to submit assignment', err);
      setIsWaitingForSubmission(true);
    }
  }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleAutomaticSubmit = async () => {
    if (!navigator.onLine) {
      setIsWaitingForNetwork(true);
    } else {
    try {
      await submitAssignment({
        assignmentId: id,
        studentId,
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          answer: answers[questionId].answer,
          matchAnswers: answers[questionId].matchAnswers,
        })),
      }).unwrap();
      console.log('All answers submitted automatically');
      setIsTestSubmitted(true);
      router.push('/student/assignment/test-submitted');

    } catch (err) {
      console.error('Failed to submit assignment automatically', err);
      setIsWaitingForSubmission(true);
    }
  }
  };

  const handleTerminateSubmit = async () => {
    if (!navigator.onLine) {
      setIsWaitingForNetwork(true);
    } else {
    try {
      await terminateAssignment({
        assignmentId: id,
        studentId,
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          answer: answers[questionId].answer,
          matchAnswers: answers[questionId].matchAnswers,
        })),
      }).unwrap();
      console.log('All answers submitted automatically');
      setIsTestSubmitted(true);
        router.push('/student/assignment/test-terminated');
    } catch (err) {
      console.error('Failed to submit assignment automatically', err);
      setIsWaitingForTerminatin(true);
    }
  }
  };
  
  const handleRetrySubmit = async () => {
    setIsWaitingForSubmission(false);
    await handleAutomaticSubmit();
  };

  const handleRetryTermination = async () => {
    setIsWaitingForSubmission(false);
    await handleTerminateSubmit();
  };
  
  const handleNetworkRestore = async () => {
    setIsWaitingForNetwork(false);
    await handleAutomaticSubmit();
  };

  if (isWaitingForNetwork) {
    return <WaitingForNetwork onNetworkRestore={handleNetworkRestore} />;
  }

  if (isWaitingForSubmission) {
    return <WaitingForSubmission onRetry={handleRetrySubmit} />;
  }

  if (isWaitingForTerminatin) {
    return <WaitingForSubmissionTermination onRetry={handleRetryTermination} />;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions available</div>;
  }

  const totalQuestions = questions.length;

  return (
    <div className="flex flex-row items-start justify-center min-h-screen p-6">
       <NetworkIndicator />
       <QuestionNavigatorSide
        questions={questions}
        answers={answers}
        flags={flags}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        handleSaveAnswer={handleSaveAnswer}
      />

       <div className="w-full max-w-2xl flex flex-col ml-24">
        <div className="flex justify-between items-center mb-4 px-6">
          <div className="text-xl font-semibold text-green-800">
            Questions {currentQuestionIndex + 1}/{totalQuestions}
          </div>
          <div className="text-sm text-red-600">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {renderQuestion(questions[currentQuestionIndex], currentQuestionIndex + 1)}

        <QuestionNavigator
          onBack={handleBack}
          onNext={handleNext}
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />

        <button
          className="mt-4 bg-green-800 text-white px-6 py-2 rounded-lg"
          onClick={handleFinalSubmit}
        >
          Submit Test
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
        type={type}
        unanswered={unanswered}
      />
    </div>
  );
}
