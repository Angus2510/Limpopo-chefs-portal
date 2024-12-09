import React from "react";
import Card from "@/components/card/index";
import Image from "next/image";

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
  if (!Array.isArray(matchAnswers)) {
    return "N/A";
  }
  return matchAnswers
    .filter((match) => match && match.pairTwo !== undefined)
    .map((match) => match.pairTwo)
    .join(", ");
};

const TestSection = ({
  result,
  marks,
  totalMarks,
  maxTotalMarks,
  handleMarksChange,
  handleSubmitMarks,
}) => {
  return (
    <Card className="p-6">
      {result.questions.map((question, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-lg font-semibold">Question {index + 1}</h2>
          <p className="text-gray-800">{question.text}</p>
          <p className="text-red-600">
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
              {question.matchAnswers
                .filter((match) => match !== null)
                .map((match, idx) => (
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
              {parseFloat(question.mark) === 1 ? "Mark" : "Marks"}:
            </label>
            <input
              type="number"
              id={`marks-${index}`}
              value={marks[index]?.score || 0}
              onChange={(e) => handleMarksChange(index, e.target.value)}
              className="w-16 border rounded-md py-1 px-2"
              disabled={result.status === "Moderated"}
            />
            <span className="ml-2">/ {parseFloat(question.mark)}</span>
          </div>
        </div>
      ))}
      <div className="text-xl font-semibold">
        Total Marks: {totalMarks} / {maxTotalMarks}
      </div>
      {result.status === "Pending" && (
        <div className="mt-8">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmitMarks}
          >
            Submit Marks
          </button>
        </div>
      )}
    </Card>
  );
};

export default TestSection;
