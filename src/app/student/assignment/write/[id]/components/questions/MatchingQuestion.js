import Image from "next/image";
import React from "react";

export default function MatchingQuestion({
  question,
  questionNumber,
  mark,
  options,
  value,
  onChange,
}) {
  const isImageUrl = (url) => url.startsWith("http");

  const handleSelectChange = (index, newValue) => {
    const updatedValue = [...value];
    const pairOne = options[index].columnA;
    const pairTwo = newValue;
    updatedValue[index] = { pairOne, pairTwo };
    onChange(updatedValue);
  };

  const numericMark = Number(mark);
  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
          Match A and B question
        </span>
        <div className="mb-2">
          <span className="text-lg font-medium text-gray-900">{question}</span>
        </div>
        <form>
          {options.map((option, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-3">
              {isImageUrl(option.columnA) ? (
                <Image
                  src={option.columnA}
                  alt={`Option ${index + 1} A`}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <span className="text-gray-700">{option.columnA}</span>
              )}
              <select
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={value[index]?.pairTwo || ""}
                onChange={(e) => handleSelectChange(index, e.target.value)}
              >
                <option value="">Choose a match</option>
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.columnB}>
                    {isImageUrl(opt.columnB) ? (
                      <span>
                        <Image
                          src={opt.columnB}
                          alt={`Option ${idx + 1} B`}
                          className="w-24 h-24 object-cover inline"
                        />
                        {opt.columnB}
                      </span>
                    ) : (
                      opt.columnB
                    )}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </form>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          {numericMark} {numericMark === 1 ? "Mark" : "Marks"}
        </span>
      </div>
    </div>
  );
}
