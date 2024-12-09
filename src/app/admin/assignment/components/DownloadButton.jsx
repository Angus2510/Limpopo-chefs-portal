// components/DownloadButton.jsx
"use client"; // Indicating this is a client-side component for Next.js

import React, { useState, useEffect } from "react"; // Importing React hooks
import { useGetAssignmentDetailsQuery } from "@/lib/features/assignment/assignmentsApiSlice"; // API hook for fetching assignment details
import generateTestPDF from "@/utils/downloadTestPDF"; // Utility function to generate PDF from assignment data
import { FiDownload } from "react-icons/fi"; // Importing the download icon

const DownloadButton = ({ assignmentId }) => {
  // State to control whether the API request should be triggered
  const [shouldFetch, setShouldFetch] = useState(false);

  // Fetching assignment details based on the `assignmentId`
  const {
    data: testDetails,
    isFetching,
    isError,
  } = useGetAssignmentDetailsQuery(assignmentId, {
    skip: !shouldFetch, // Skip the query if `shouldFetch` is false
  });

  // Effect hook to generate the PDF once test details are fetched
  useEffect(() => {
    if (testDetails) {
      generateTestPDF(testDetails); // Generate the PDF using the fetched data
      setShouldFetch(false); // Reset the fetch trigger to prevent unnecessary API calls
    }
  }, [testDetails]); // Dependency array to run effect when `testDetails` changes

  return (
    <button
      onClick={(event) => {
        event.stopPropagation(); // Prevent click from propagating to parent elements
        setShouldFetch(true); // Trigger the fetch to get the assignment details
      }}
      className="text-gray-500 hover:text-gray-700" // Button styling with hover effect
      disabled={isFetching || isError} // Disable button if fetching or error occurs
    >
      <FiDownload /> {/* Displaying the download icon */}
    </button>
  );
};

export default DownloadButton; // Exporting the component for use in other parts of the application
