"use client";
import React, { useState } from "react";
import DataTable from "./DataTable";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAllStudents } from "@/lib/features/students/studentsApiSlice";
import { useGetStudentsQuery } from "@/lib/features/students/studentsApiSlice";
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";
import { useGenerateSorReportMutation } from "@/lib/features/sor/sorApiSlice";

const SorTable = () => {
  const router = useRouter();

  const {
    data: studentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudentsQuery();

  const students = useSelector(selectAllStudents);

  const {
    data: intakeGroupsNormalized,
    isLoading: intakeGroupsLoading,
    isError: intakeGroupsError,
    error: intakeGroupsFetchError,
    refetch: refetchIntakeGroups,
  } = useGetIntakeGroupsQuery();
  const {
    data: campusesNormalized,
    isLoading: campusesLoading,
    isError: campusesError,
    error: campusesFetchError,
    refetch: refetchCampuses,
  } = useGetCampusesQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  const [generateSorReport] = useGenerateSorReportMutation();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [typeFilter, setTypeFilter] = useState("");

  const handleTypeChange = (value) => {
    setTypeFilter(value);
  };

  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));

  const filters = [
    {
      id: "intakeGroup",
      options: intakeGroupOptions,
      defaultOption: "All Intakes",
    },
    {
      id: "campus",
      options: campusOptions,
      defaultOption: "All Campuses",
    },
  ];

  const transformedStudents = students.map((student) => ({
    ...student,
    campus: student.campus.map((group) => group.title).join(", "),
    intakeGroup: student.intakeGroup.map((group) => group.title).join(", "),
  }));

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
      await generateSorReport(selectedIds);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGeneratingReport(false);
      setShowConfirmation(false);
    }
  };

  const handleGenerateReportClick = (ids) => {
    setSelectedIds(ids);
    if (ids.length > 20) {
      setShowConfirmation(true);
    } else {
      handleGenerateReport();
    }
  };
  return (
    <>
      <DataTable
        data={transformedStudents}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search uploads..."
        onGenerateReport={handleGenerateReportClick}
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

export default SorTable;
