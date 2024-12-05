"use client"
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';

import { useSelector } from 'react-redux';
import { selectAllAssignments} from '@/lib/features/assignment/assignmentsApiSlice';
import { useGetAssignmentsQuery} from '@/lib/features/assignment/assignmentsApiSlice';

const PasswordModal = ({ test, onClose }) => {
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleConfirm = () => {
    if (password === test.password) {
      onClose();
      router.push(`/student/assignment/write/${test.id}`);
    } else {
      alert('Incorrect password. Please try again.');
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
                  <p className="text-sm text-gray-500">Please enter the password to start the test &quot;{test.name}&quot;.</p>
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
              Confirm
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestList = () => {

  const {
    data: assignmentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAssignmentsQuery();

  const tests = useSelector((state) => {
    const allAssignments = selectAllAssignments(state);
    console.log('All Assignments:', allAssignments);
    
    const filteredAssignments = allAssignments.filter(assignment => {
      const hasMokopaneCampus = assignment.campus.some(campus => campus.title === 'Mokopane');
      const hasIntake1 = assignment.intakeGroups.some(intake => intake.title === 'Intake 1');
      console.log('Has Mokopane Campus:', hasMokopaneCampus);
      console.log('Has Intake 1:', hasIntake1);
      return hasMokopaneCampus && hasIntake1;
    });
    console.log('Filtered Assignments:', filteredAssignments);
    
    return filteredAssignments;
  });

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const currentTime = new Date();


  useEffect(() => {
    const interval = setInterval(() => {
      tests.forEach((test) => {
        const startTime = new Date(test.availableFrom);
        const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes after start time
  
        // Check if startTime, endTime, and currentTime are valid dates
        if (!isNaN(startTime) && !isNaN(endTime) && !isNaN(currentTime)) {
          const buttonElement = document.getElementById(`startTestButton_${test.id}`);
          if (buttonElement) {
            if (currentTime < startTime || currentTime > endTime) {
              // Disable the button if the current time is not within the availability window
              buttonElement.disabled = true;
              buttonElement.classList.remove('bg-green-500', 'text-white');
              buttonElement.classList.add('bg-gray-300', 'text-gray-600', 'cursor-not-allowed');
            } else {
              // Enable the button if the current time is within the availability window
              buttonElement.disabled = false;
              buttonElement.classList.remove('bg-gray-300', 'text-gray-600', 'cursor-not-allowed');
              buttonElement.classList.add('bg-green-500', 'text-white');
            }
          }
        } else {
          // Disable the button if any of the dates are invalid
          const buttonElement = document.getElementById(`startTestButton_${test.id}`);
          if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.classList.remove('bg-green-500', 'text-white');
            buttonElement.classList.add('bg-gray-300', 'text-gray-600', 'cursor-not-allowed');
          }
        }
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [tests, currentTime]);
  
  

  tests.sort((a, b) => {
    const dateA = new Date(a.availableFrom);
    const dateB = new Date(b.availableFrom);
    
    return dateB - dateA;
  });

  const columns = [
    { Header: 'Test Name', accessor: 'title' },
    { Header: 'Created By', accessor: 'lecturer.profile.firstName' },
    { Header: 'Overall Outcome', accessor: 'outcome', Cell: ({ value }) => value.map(group => group.title).join(', ') },
    { 
      Header: 'Date', 
      accessor: 'availableFrom',
      Cell: ({ value }) => new Date(value).toLocaleString()
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <button
      id={`startTestButton_${row.original.id}`}
      onClick={() => {
        setSelectedTest(row.original);
        setShowPasswordModal(true);
        console.log("clicked button")
      }}
      className={`py-2 px-4 rounded ${
        new Date(row.original.availableFrom) <= currentTime &&
        currentTime <= new Date(row.original.availableFrom) + 30 * 60 * 1000
          ? 'bg-green-500 text-white'
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
      disabled={
        !(new Date(row.original.availableFrom) <= currentTime &&
        currentTime <= new Date(row.original.availableFrom) + 30 * 60 * 1000)
      }
    >
      Start Test
    </button>
      
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={tests}
        columns={columns}
        searchPlaceholder="Search tests..."
      />
      {showPasswordModal && (
        <PasswordModal
          test={selectedTest}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};

export default TestList;
