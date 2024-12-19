"use client";
import React, { useState, useEffect } from "react";
import StudentDataTable from "./StudentDataTable";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentStudent } from "@/lib/features/students/studentsApiSlice"; // Assuming we have a selector to fetch the current logged-in student
import { useGetStudentQuery } from "@/lib/features/students/studentsApiSlice"; // Query hook to fetch student data
import { useGenerateSorReportMutation } from "@/lib/features/sor/sorApiSlice";

const StudentSorTable = () => {
  const router = useRouter();

  // Assuming we have a selector or query to get the current logged-in student's ID
  const currentStudentId = useSelector(selectCurrentStudent); // If you are using redux, this would fetch the logged-in student's ID
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useGetStudentQuery(currentStudentId); // Fetch the data for the current student
  const [generateSorReport] = useGenerateSorReportMutation();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([currentStudentId]);

  const [typeFilter, setTypeFilter] = useState("");
  const [filters] = useState([]); // No filters needed for a single student

  // Transform the student data if necessary
  const transformedStudent = {
    ...student,
    campus: student?.campus?.map((group) => group.title).join(", ") || "",
    intakeGroup:
      student?.intakeGroup?.map((group) => group.title).join(", ") || "",
  };

  const columns = [
    { Header: "Student No", accessor: "admissionNumber" },
    { Header: "First Name", accessor: "profile.firstName" },
    { Header: "Last Name", accessor: "profile.lastName" },
    { Header: "Date of Birth", accessor: "profile.dateOfBirth" },
    { Header: "Gender", accessor: "profile.gender" },
    { Header: "Mobile Number", accessor: "profile.mobileNumber" },
  ];

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generateSorReport(selectedIds); // Generate report for the logged-in student
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGeneratingReport(false);
      setShowConfirmation(false);
    }
  };

  const handleGenerateReportClick = () => {
    setSelectedIds([currentStudentId]);
    handleGenerateReport(); // Directly call the report generation without any confirmation (for single student)
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <>
      <StudentDataTable
        studentData={transformedStudent} // Pass the single student data
        columns={columns}
        filters={filters}
        isGenerating={isGeneratingReport}
      />
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
            <p>
              Are you sure you want to proceed? The server might not be able to
              handle the amount of requests.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleGenerateReport}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSorTable;
