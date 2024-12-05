import React from 'react';
import Card from '@/components/card/index';
const TestDetailsSection = ({ result }) => {
  console.log(result)
  return (
    <Card className="mb-6 p-6">
      <h1 className="text-3xl font-bold mb-4">Mark Test</h1>
      <div className="space-y-4">
        <div>
          <h2>{result.assignmentTitle}</h2>
        </div>
        <div>
          <p><strong>Student Name:</strong> {result.studentDetails.firstName} {result.studentDetails.lastName}</p>
          <p><strong>Student Number:</strong> {result.studentDetails.studentNo}</p>
          <p><strong>Intake Group:</strong> {result.studentDetails.intakeGroup}</p>
          <p><strong>Campus:</strong> {result.studentDetails.campus}</p>
          <p><strong>Created By:</strong> {result.studentDetails.createdBy}</p>
          <p><strong>Date of Test:</strong> {result.studentDetails.dateOfTest}</p>
          <p><strong>Test Duration:</strong> {result.studentDetails.testDuration}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Marked By:</strong> {result.markedBy}</p>
        </div>
      </div>
    </Card>
  );
};

export default TestDetailsSection;
