import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetAssignmentByIdQuery } from '@/lib/features/assignment/assignmentsApiSlice';
import { useStartWritingAssignmentMutation } from '@/lib/features/assignment/studentAssignmentsApiSlice';

export default function AssignmentView({ onStartTest, id, studentId }) {
  const router = useRouter();

  const {
    data: assignmentData,
    isFetching,
    isSuccess,
    isError,
    error
  } = useGetAssignmentByIdQuery(id);

  const assignment = assignmentData?.entities[id];

  const [startWritingAssignment, { isLoading: isStarting }] = useStartWritingAssignmentMutation();

  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.data?.message || 'Could not fetch the assignment'}</div>;
  }

  const formatLocalDate = (isoDate) => {
    return new Date(isoDate).toLocaleString();
  };

  const handleStartTest = async () => {
    try {
      const response = await startWritingAssignment({ assignmentId: id, studentId: studentId }).unwrap();
      console.log('Start Writing Assignment Response:', response);

      onStartTest(assignment, assignment.duration, assignment.type, response.questions); // Pass questions here
    } catch (err) {
      console.error('Failed to start writing assignment:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {isSuccess && assignment ? (
        <div className="w-full max-w-2xl relative">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 mb-4">
            <div className="mb-4">
              <p className="text-gray-800 mt-1">{assignment.type === 'Test' ? 'Test Title' : 'Task Title'}</p>
              <h2 className="text-xl font-semibold">{assignment.title}</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 mt-1">Lecturer</p>
              <h2 className="text-xl font-semibold">{assignment.lecturer.profile.firstName}</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 mt-1">Type</p>
              <h2 className="text-xl font-semibold">{assignment.type}</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 mt-1">Date and Time</p>
              <h2 className="text-xl font-semibold">{formatLocalDate(assignment.availableFrom)}</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 mt-1">Duration</p>
              <h2 className="text-xl font-semibold">{assignment.duration} min</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 mt-1">Rules and Instruction</p>
              <h2 className="text-xl font-semibold">PLEASE FOLLOW THE INSTRUCTION BELOW FOR COMPLETING AN ONLINE TEST:</h2>
              <p className="text-gray-800 mt-1">Read all the questions carefully before answering.</p>
              <p className="text-gray-800 mt-1">Make sure you answer all the questions before pressing the submit button.</p>
              <p className="text-gray-800 mt-1">You are not allowed to do the following:</p>
              <p className="text-gray-800 mt-1">1.1 Take a screenshot of the test (IMMEDIATE FAIL)</p>
              <p className="text-gray-800 mt-1">1.2 Leave/Exit the test at any time (IMMEDIATE FAIL)</p>
              <p className="text-gray-800 mt-1">1.3 Opening another tab on your internet browser/test page during the duration of the test (IMMEDIATE FAIL)</p>
              <p className="text-gray-800 mt-1">Archieving less than 40% for the test will result in an automatic re-write fee of R450.00</p>
            </div>
          </div>
          <button
            className="absolute top-full right-0 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            onClick={handleStartTest}
          >
            Start
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">No assignment found.</div>
        </div>
      )}
    </div>
  );
}
