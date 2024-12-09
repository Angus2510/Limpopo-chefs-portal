import React from "react";
import { useGetStudentResultsByIdQuery } from "@/lib/features/results/resultsApiSlice"; // Importing the API query hook for student results
import Card from "@/components/card"; // Importing the Card component to wrap the content

// StudentResults component to display student's results
const StudentResults = ({ studentId }) => {
  // Fetching student results data using the provided studentId
  const {
    data: studentResults,
    error,
    isLoading,
  } = useGetStudentResultsByIdQuery(studentId);

  // Display loading message while the data is being fetched
  if (isLoading) return <p>Loading...</p>;

  // Display error message if there is an error fetching the data
  if (error) return <p>Error loading data</p>;

  // Function to map outcomes to their respective abbreviations
  const mapOutcome = (outcome) => {
    if (outcome === "Not Yet Competent") return "NYC"; // Mapping "Not Yet Competent" to "NYC"
    if (outcome === "Competent") return "C"; // Mapping "Competent" to "C"
    return outcome; // Returning the outcome as is if it's neither "Not Yet Competent" nor "Competent"
  };

  // Debugging the student results data
  console.log("Student Results:", studentResults);

  // Filtering results into two categories: practical and theory
  const practicalResults = studentResults.results.filter(
    (res) => res.outcomeType !== "Theory"
  ); // Filtering practical results
  const theoryResults = studentResults.results.filter(
    (res) => res.outcomeType === "Theory"
  ); // Filtering theory results

  // Debugging practical and theory results
  console.log("Practical Results:", practicalResults);
  console.log("Theory Results:", theoryResults);

  return (
    <div>
      {/* Card component for theory results table */}
      <Card className="w-full pb-10 p-4 h-full">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr>
              {/* Table header for the theory results */}
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Unit Title
                </div>
              </th>
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Test
                </div>
              </th>
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Task
                </div>
              </th>
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Overall Outcome
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through theory results and displaying each result */}
            {theoryResults.map((result, index) => (
              <tr key={index}>
                {/* Displaying outcome title, test score, task score, and overall outcome for each theory result */}
                <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                <td className="pt-[14px] pb-[20px]">{result.testScore}</td>
                <td className="pt-[14px] pb-[20px]">{result.taskScore}</td>
                <td className="pt-[14px] pb-[20px]">
                  {mapOutcome(result.overallOutcome)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Card component for practical results table */}
      <Card className="w-full pb-10 p-4 h-full mt-8">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr>
              {/* Table header for practical results */}
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Title
                </div>
              </th>
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Outcome Result
                </div>
              </th>
              <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Overall Outcome
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through practical results and displaying each result */}
            {practicalResults.map((result, index) => (
              <tr key={index}>
                {/* Displaying outcome title, score, and overall outcome for each practical result */}
                <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                <td className="pt-[14px] pb-[20px]">{result.score}</td>
                <td className="pt-[14px] pb-[20px]">
                  {mapOutcome(result.overallOutcome)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default StudentResults;
