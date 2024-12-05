// components/DownloadButton.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useGetAssignmentDetailsQuery } from '@/lib/features/assignment/assignmentsApiSlice';
import generateTestPDF from '@/utils/downloadTestPDF';
import { FiDownload } from 'react-icons/fi';

const DownloadButton = ({ assignmentId }) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: testDetails, isFetching, isError } = useGetAssignmentDetailsQuery(assignmentId, {
    skip: !shouldFetch
  });

  useEffect(() => {
    if (testDetails) {
      generateTestPDF(testDetails);
      setShouldFetch(false); // Reset the fetch trigger
    }
  }, [testDetails]);

  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        setShouldFetch(true);
      }}
      className="text-gray-500 hover:text-gray-700"
      disabled={isFetching || isError}
    >
      <FiDownload />
    </button>
  );
};

export default DownloadButton;
