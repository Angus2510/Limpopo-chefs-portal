import React from 'react';
import { useGetStudentResultsByIdQuery } from '@/lib/features/results/resultsApiSlice';
import Card from '@/components/card';

const StudentResults = ({ studentId }) => {
  const { data: studentResults, error, isLoading } = useGetStudentResultsByIdQuery(studentId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const roundValue = (value) => {
    return value >= 0.5 ? Math.ceil(value) : Math.floor(value);
  };

  const parsePercentage = (value) => {
    const parsed = parseFloat(value.replace('%', ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateOverallOutcome = (score, type) => {
    if (type === 'Practical') {
      return score >= 70 ? 'C' : 'NYC';
    } else {
      return score >= 60 ? 'C' : 'NYC';
    }
  };

  console.log("Student Results:", studentResults);

  const practicalResults = studentResults.results
    .filter(res => res.outcomeType === 'Practical')
    .sort((a, b) => a.outcomeTitle.localeCompare(b.outcomeTitle));

  const examsWellResults = studentResults.results
    .filter(res => res.outcomeType === 'Exams/Well')
    .sort((a, b) => a.outcomeTitle.localeCompare(b.outcomeTitle));

  const theoryResults = studentResults.results
    .filter(res => res.outcomeType === 'Theory')
    .sort((a, b) => a.outcomeTitle.localeCompare(b.outcomeTitle));

  console.log("Practical Results:", practicalResults);
  console.log("Exams/Well Results:", examsWellResults);
  console.log("Theory Results:", theoryResults);

  return (
    <div>
      <Card className="w-full pb-10 p-4 h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr>
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
                  Overall
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
            {theoryResults.map((result, index) => {
              const testScore = roundValue(parsePercentage(result.testScore));
              const taskScore = roundValue(parsePercentage(result.taskScore));
              const overallScore = (testScore && taskScore)
                ? roundValue((testScore + taskScore) / 2)
                : 'N/A';
              const overallOutcome = overallScore !== 'N/A' ? calculateOverallOutcome(overallScore, 'Theory') : 'N/A';

              if (testScore === 0 && taskScore === 0) {
                return null;
              }

              return (
                <tr key={index}>
                  <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                  <td className="pt-[14px] pb-[20px]">{testScore !== 0 ? `${testScore}%` : ''}</td>
                  <td className="pt-[14px] pb-[20px]">{taskScore !== 0 ? `${taskScore}%` : ''}</td>
                  <td className="pt-[14px] pb-[20px]">{overallScore !== 'N/A' ? `${overallScore}%` : 'N/A'}</td>
                  <td className="pt-[14px] pb-[20px]">{overallOutcome}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Card>
      <Card className="w-full pb-10 p-4 h-full mt-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr>
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
            {[...practicalResults, ...examsWellResults].map((result, index) => {
              const score = roundValue(parsePercentage(result.score));
              const overallOutcome = calculateOverallOutcome(score, result.outcomeType);

              if (score === 0) {
                return null;
              }

              return (
                <tr key={index}>
                  <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                  <td className="pt-[14px] pb-[20px]">{score !== 0 ? `${score}%` : ''}</td>
                  <td className="pt-[14px] pb-[20px]">{overallOutcome}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentResults;
