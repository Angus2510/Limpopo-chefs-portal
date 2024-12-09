"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/card/index";
import {
  useGetResultByIdQuery,
  useAddCommentToResultMutation,
  useUpdateResultByIdMutation,
  useUpdateModeratedMarksByIdMutation,
} from "@/lib/features/assignment/assignmentsResultsApiSlice";
import Image from "next/image";

function TestDetailsForm({ id }) {
  const { data: result, isLoading, isError } = useGetResultByIdQuery(id);
  const [addComment] = useAddCommentToResultMutation();
  const [updateResultById] = useUpdateResultByIdMutation();
  const [updateModeratedMarksById] = useUpdateModeratedMarksByIdMutation();

  const [comments, setComments] = useState("");
  const [submittedComments, setSubmittedComments] = useState([]);
  const [marks, setMarks] = useState([]);
  const [moderatedMarks, setModeratedMarks] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalModeratedMarks, setTotalModeratedMarks] = useState(0);
  const [maxTotalMarks, setMaxTotalMarks] = useState(0);
  const [isModerating, setIsModerating] = useState(false);

  useEffect(() => {
    if (result) {
      console.log("Fetched Result:", result);
      setSubmittedComments(result.studentDetails.feedback || []);
      const initialMarks = result.questions.map((question) => ({
        answerId: question.studentAnswer._id,
        score: question.score || 0,
        moderatedScore: question.moderatedScore || 0,
      }));
      setMarks(initialMarks);
      if (result.status === "Moderated") {
        setModeratedMarks(
          initialMarks.map((mark) => ({
            answerId: mark.answerId,
            score: mark.moderatedScore,
          }))
        );
        setTotalModeratedMarks(
          initialMarks.reduce((acc, curr) => acc + curr.moderatedScore, 0)
        );
        setIsModerating(true);
      } else {
        setModeratedMarks(initialMarks);
        setTotalModeratedMarks(
          initialMarks.reduce((acc, curr) => acc + curr.score, 0)
        );
      }
      setTotalMarks(initialMarks.reduce((acc, curr) => acc + curr.score, 0));
      setMaxTotalMarks(
        result.questions.reduce(
          (acc, question) => acc + (parseFloat(question.mark) || 0),
          0
        )
      );
    }
  }, [result]);

  const handleMarksChange = (index, value, isModerated = false) => {
    const newMarks = isModerated ? [...moderatedMarks] : [...marks];
    newMarks[index] = {
      ...newMarks[index],
      score: parseFloat(value) || 0, // Ensure value is a number
    };
    if (isModerated) {
      setModeratedMarks(newMarks);
      setTotalModeratedMarks(
        newMarks.reduce((acc, curr) => acc + curr.score, 0)
      );
    } else {
      setMarks(newMarks);
      setTotalMarks(newMarks.reduce((acc, curr) => acc + curr.score, 0));
    }
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleCommentsSubmit = async () => {
    if (comments.trim()) {
      try {
        await addComment({ id, comment: comments }).unwrap();
        setSubmittedComments([...submittedComments, comments]);
        setComments("");
      } catch (err) {
        console.error("Failed to submit comment: ", err);
      }
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

      console.log("Submitting updated marks with payload:", payload);

      await updateResultById({ id, data: payload }).unwrap();
      alert("Marks submitted successfully!");
    } catch (err) {
      console.error("Failed to submit marks:", err);
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
      };

      console.log("Submitting moderated marks with payload:", payload);

      await updateModeratedMarksById({ id, data: payload }).unwrap();
      alert("Moderated marks submitted successfully!");
    } catch (err) {
      console.error("Failed to submit moderated marks:", err);
    }
  };

  const renderAnswer = (answer) => {
    if (typeof answer === "object" && answer !== null) {
      return answer.value || JSON.stringify(answer);
    }
    return answer;
  };

  const renderCorrectAnswer = (correctAnswer, type) => {
    if (type === "MultipleChoice") {
      return correctAnswer.join(", ");
    }
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.map((answer) => answer.columnB).join(", ");
    }
    return correctAnswer;
  };

  const renderMatchAnswer = (matchAnswers) => {
    return matchAnswers.map((match) => match.pairTwo).join(", ");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading assignment result</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card className="mb-6 p-6">
        <h1 className="text-3xl font-bold mb-4">Mark Test</h1>
        <div className="space-y-4">
          <div>
            <h2>{result.assignmentTitle}</h2>
          </div>
          <div>
            <p>
              <strong>Student Name:</strong> {result.studentDetails.firstName}{" "}
              {result.studentDetails.lastName}
            </p>
            <p>
              <strong>Student Number:</strong> {result.studentDetails.studentNo}
            </p>
            <p>
              <strong>Intake Group:</strong> {result.studentDetails.intakeGroup}
            </p>
            <p>
              <strong>Campus:</strong> {result.studentDetails.campus}
            </p>
            <p>
              <strong>Created By:</strong> {result.studentDetails.createdBy}
            </p>
            <p>
              <strong>Date of Test:</strong> {result.studentDetails.dateOfTest}
            </p>
            <p>
              <strong>Test Duration:</strong>{" "}
              {result.studentDetails.testDuration}
            </p>
            <p>
              <strong>Status:</strong> {result.status}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div>
          {result.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-lg font-semibold">Question {index + 1}</h2>
              <p className="text-gray-800">{question.text}</p>
              <p className="text-gray-600">
                Correct Answer:{" "}
                {renderCorrectAnswer(question.correctAnswer, question.type) ||
                  "N/A"}
              </p>
              <p className="text-gray-600">
                Student Answer:{" "}
                {question.type === "Match"
                  ? renderMatchAnswer(question.matchAnswers)
                  : renderAnswer(question.studentAnswer.value)}
              </p>

              {question.type === "MultipleChoice" && (
                <div className="mb-4">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded-lg ${
                        option.value === question.studentAnswer.value
                          ? question.correctAnswer.includes(option.value)
                            ? "bg-green-200"
                            : "bg-red-200"
                          : "bg-gray-200"
                      }`}
                    >
                      {option.value}{" "}
                      {question.correctAnswer.includes(option.value)
                        ? "(Correct)"
                        : ""}
                    </div>
                  ))}
                </div>
              )}

              {question.type === "Match" && (
                <div>
                  <h3 className="text-md font-semibold">Correct Match:</h3>
                  {question.options.map((pair, idx) => (
                    <div key={idx} className="text-sm">
                      {pair?.columnA?.startsWith("http") ? (
                        <Image
                          src={pair.columnA}
                          alt="Column A"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      ) : (
                        pair.columnA
                      )}{" "}
                      matches with {pair.columnB}
                    </div>
                  ))}
                  <h3 className="text-md font-semibold mt-2">Student Match:</h3>
                  {question.matchAnswers.map((match, idx) => (
                    <div key={idx} className="text-sm">
                      {match?.pairOne?.startsWith("http") ? (
                        <Image
                          src={match.pairOne}
                          alt="Pair One"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      ) : (
                        match.pairOne
                      )}{" "}
                      matches with {match.pairTwo}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center mt-2">
                <label htmlFor={`marks-${index}`} className="mr-2">
                  Marks:
                </label>
                <input
                  type="number"
                  id={`marks-${index}`}
                  value={marks[index]?.score || 0}
                  onChange={(e) => handleMarksChange(index, e.target.value)}
                  className="w-16 border rounded-md py-1 px-2"
                  disabled={isModerating || result.status === "Moderated"}
                />
                <span className="ml-2">/ {parseFloat(question.mark)}</span>
              </div>
              {isModerating && (
                <div className="flex items-center mt-2">
                  <label htmlFor={`moderated-marks-${index}`} className="mr-2">
                    Moderated Marks:
                  </label>
                  <input
                    type="number"
                    id={`moderated-marks-${index}`}
                    value={moderatedMarks[index]?.score || 0}
                    onChange={(e) =>
                      handleMarksChange(index, e.target.value, true)
                    }
                    className="w-16 border rounded-md py-1 px-2"
                  />
                  <span className="ml-2">/ {parseFloat(question.mark)}</span>
                </div>
              )}
            </div>
          ))}
          <div className="text-xl font-semibold">
            Total Marks: {totalMarks} / {maxTotalMarks}
            {isModerating && (
              <div>
                Moderated Total Marks: {totalModeratedMarks} / {maxTotalMarks}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          {result.status === "Marked" && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsModerating(!isModerating)}
            >
              {isModerating ? "End Moderation" : "Moderate"}
            </button>
          )}
          {result.status === "Pending" && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmitMarks}
            >
              Submit Marks
            </button>
          )}
          {(isModerating || result.status === "Moderated") && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmitModeratedMarks}
            >
              Submit Moderated Marks
            </button>
          )}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <textarea
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Add your comments here..."
          className="w-full border rounded-md p-2 mb-4"
          rows="4"
        />
        <button
          onClick={handleCommentsSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Comment
        </button>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Submitted Comments:</h3>
          {submittedComments.length > 0 ? (
            <ul>
              {submittedComments.map((comment, index) => (
                <li key={index} className="border-b py-2">
                  {comment}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TestDetailsForm;
