import React from 'react';
import { useGetStudentResultsByIdQuery } from '@/lib/features/results/resultsApiSlice';
import Card from '@/components/card';

const StudentResults = ({ studentId }) => {
  const { data: studentResults, error, isLoading } = useGetStudentResultsByIdQuery(studentId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const mapOutcome = (outcome) => {
    if (outcome === 'Not Yet Competent') return 'NYC';
    if (outcome === 'Competent') return 'C';
    return outcome;
  };

  console.log("Student Results:", studentResults);

  const practicalResults = studentResults.results.filter(res => res.outcomeType !== 'Theory');
  const theoryResults = studentResults.results.filter(res => res.outcomeType === 'Theory');

  console.log("Practical Results:", practicalResults);
  console.log("Theory Results:", theoryResults);

  return (
    <div>
      <Card className="w-full pb-10 p-4 h-full">
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
                  Overall Outcome
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {theoryResults.map((result, index) => (
              <tr key={index}>
                <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                <td className="pt-[14px] pb-[20px]">{result.testScore}</td>
                <td className="pt-[14px] pb-[20px]">{result.taskScore}</td>
                <td className="pt-[14px] pb-[20px]">{mapOutcome(result.overallOutcome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="w-full pb-10 p-4 h-full mt-8">
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
            {practicalResults.map((result, index) => (
              <tr key={index}>
                <td className="pt-[14px] pb-[20px]">{result.outcomeTitle}</td>
                <td className="pt-[14px] pb-[20px]">{result.score}</td>
                <td className="pt-[14px] pb-[20px]">{mapOutcome(result.overallOutcome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default StudentResults;
