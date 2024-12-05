'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { useGetStudentAssignmentsQuery, useStartAssignmentMutation } from '@/lib/features/assignment/studentAssignmentsApiSlice';

const PasswordModal = ({ test, onClose, studentId, setIsLoadingPage}) => {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [startAssignment, { isLoading, isError, error }] = useStartAssignmentMutation();

  const handleConfirm = async () => {
    try {
      const response = await startAssignment({ assignmentId: test.id, studentId, password }).unwrap();
      console.log('Start assignment response:', response);
      if (response.msg === 'Access granted') {
        setIsLoadingPage(true); 
        onClose();
        router.push(`/student/assignment/write/${test.id}`);
        //setIsLoadingPage(false); 
      } else {
        alert('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('Error starting assignment:', err); 
      alert(`Error ${err.data?.msg} starting assignment. Please try again.`);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Enter Password</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Please enter the password to start the test &quot;{test.title}&quot;.</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isLoading ? 'Checking...' : 'Confirm'}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
          {isError && <p className="text-red-500 mt-2">{error?.data?.message}</p>}
        </div>
      </div>
    </div>
  );
};

const TestList = ({ studentId }) => {
  const {
    data: assignmentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudentAssignmentsQuery(studentId);

  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [prevAvailableTestCount, setPrevAvailableTestCount] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedAvailableTests = assignmentsNormalized?.ids
        .map(id => assignmentsNormalized.entities[id])
        .filter(test => {
          const availableFrom = new Date(test.availableFrom);
          const availableUntil = new Date(test.availableUntil);
          return now >= availableFrom && now <= availableUntil;
        });

      if (updatedAvailableTests.length !== prevAvailableTestCount) {
        setPrevAvailableTestCount(updatedAvailableTests.length);
        setAvailableTests(updatedAvailableTests);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assignmentsNormalized, prevAvailableTestCount]);

  const handlePageChange = (newPage) => {
    if (newPage === 0 && prevAvailableTestCount !== availableTests.length) {
      // Reset page index only when a new test becomes available
      return 0;
    }
    return newPage;
  };

  const columns = [
    { Header: 'Test Name', accessor: 'title' },
    { Header: 'Created By', accessor: 'lecturer' },
    { Header: 'Overall Outcome', accessor: 'outcome' },
    { Header: 'Duration', accessor: 'duration' },
    { 
      Header: 'Date', 
      accessor: 'availableFrom',
      Cell: ({ value }) => new Date(value).toLocaleString()
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => {
        const test = row.original;
        const isAvailable = availableTests.some(t => t._id === test._id);
    
        return (
          <button
            onClick={() => {
              if (isAvailable) {
                setSelectedTest(row.original);
                setShowPasswordModal(true);
              }
            }}
            className={`bg-${isAvailable ? 'green' : 'gray'}-500 hover:bg-${isAvailable ? 'green' : 'gray'}-700 text-white font-bold py-2 px-4 rounded ${isAvailable ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Start Test' : 'Not Available'}
          </button>
        );
      },
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message}</p>;

  const data = assignmentsNormalized?.ids.map(id => assignmentsNormalized.entities[id]) || [];
  const sortedData = data.sort((a, b) => new Date(b.availableFrom) - new Date(a.availableFrom));

  return (
    <>
      {isLoadingPage && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <p className="text-white font-semibold">Loading...</p>
        </div>
      )}
      <DataTable
        data={sortedData}
        columns={columns}
        searchPlaceholder="Search tests..."
        getCurrentPage={handlePageChange}
      />
      {showPasswordModal && (
        <PasswordModal
          test={selectedTest}
          onClose={() => setShowPasswordModal(false)}
          studentId={studentId}
          setIsLoadingPage={setIsLoadingPage}
        />
      )}
    </>
  );
};

export default TestList;
