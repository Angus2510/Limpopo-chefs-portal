"use client";
import React, { useState, useMemo } from "react";
import DataTable from "@/components/tables/BasicTable"; // Custom table component
import { useRouter } from "next/navigation"; // Hook for navigation in Next.js
import { FiEdit, FiCopy, FiEye, FiDownload } from "react-icons/fi"; // Icons for actions

// Redux imports for accessing global state
import { useSelector } from "react-redux";
import { selectAllAssignments } from "@/lib/features/assignment/assignmentsApiSlice";

// Queries to fetch data for the various entities (intake groups, campuses, outcomes)
import { useGetAssignmentsQuery } from "@/lib/features/assignment/assignmentsApiSlice";
import DownloadButton from "./DownloadButton"; // Button component for downloading assignments

import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup/intakeGroupApiSlice";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";
import {
  useGetOutcomesQuery,
  selectAllOutcomes,
} from "@/lib/features/outcome/outcomeApiSlice";

const TestsTable = () => {
  // Next.js router for handling navigation
  const router = useRouter();

  // Fetching intake groups, campuses, and outcomes data from the API
  const {
    data: intakeGroupsNormalized,
    isLoading: intakeGroupsLoading,
    isError: intakeGroupsError,
  } = useGetIntakeGroupsQuery();
  const {
    data: campusesNormalized,
    isLoading: campusesLoading,
    isError: campusesError,
  } = useGetCampusesQuery();
  const {
    data: outcomesNormalized,
    isLoading: outcomesLoading,
    isError: outcomesError,
  } = useGetOutcomesQuery();

  // Fetch assignments data from the API and handle loading/error states
  const {
    data: assignmentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAssignmentsQuery();

  // Accessing the Redux store for assignments, intake groups, campuses, and outcomes
  const tests = useSelector(selectAllAssignments);
  const intakeGroups = useSelector(selectAllIntakeGroups) ?? [];
  const campuses = useSelector(selectAllCampuses) ?? [];
  const outcomes = useSelector(selectAllOutcomes) ?? [];

  // Mapping the data to a format suitable for the filter dropdowns
  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));
  const outcomesOptions = outcomes.map((outcomes) => ({
    label: outcomes.title,
    value: outcomes.title,
  }));

  // Defining filter options for the table
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
    {
      id: "overallOutcome",
      options: outcomesOptions,
      defaultOption: "All Outcomes",
    },
    {
      id: "type",
      options: [
        { label: "Test", value: "Test" },
        { label: "Task", value: "Task" },
      ],
      defaultOption: "All Types",
    },
  ];

  // Function to format date as a readable string
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
  };

  // Function to format date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Memoized transformation and sorting of tests data
  const transformedAndSortedTests = useMemo(() => {
    const transformed = tests.map((test) => ({
      ...test,
      // Joining campuses and intake groups with commas for display
      campus: Array.isArray(test.campus)
        ? test.campus.map((c) => c.title).join(", ")
        : "N/A",
      intakeGroup: Array.isArray(test.intakeGroups)
        ? test.intakeGroups.map((group) => group.title).join(", ")
        : "N/A",
      // Displaying lecturer's first and last name
      createdBy: `${test.lecturer?.profile?.firstName || "N/A"} ${
        test.lecturer?.profile?.lastName || ""
      }`,
      // Joining outcomes with commas for display
      overallOutcome: Array.isArray(test.outcome)
        ? test.outcome.map((outcome) => outcome.title).join(", ")
        : "N/A",
      // Formatting test date and created date
      testDate: test.availableFrom ? formatDateTime(test.availableFrom) : "N/A",
      dateCreated: test.createdAt ? formatDate(test.createdAt) : "N/A",
    }));

    // Sorting tests by test date in descending order
    return transformed.sort(
      (a, b) => new Date(b.testDate) - new Date(a.testDate)
    );
  }, [tests]);

  // Column configuration for DataTable
  const columns = [
    { Header: "Test Name", accessor: "title" },
    { Header: "Date Created", accessor: "dateCreated" },
    { Header: "Test Date", accessor: "testDate" },
    { Header: "Created By", accessor: "createdBy" },
    { Header: "Campus", accessor: "campus" },
    { Header: "Intake Group", accessor: "intakeGroup" },
    { Header: "Overall Outcome", accessor: "overallOutcome" },
    { Header: "Exam Type", accessor: "type" },
    { Header: "Password", accessor: "password" },
    {
      Header: "Actions", // Action buttons for editing, duplicating, viewing, and downloading
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click propagation
              router.push(`/admin/assignment/edit/${row.original._id}`); // Navigate to edit page
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/assignment/duplicate/${row.original._id}`); // Navigate to duplicate page
            }}
            className="text-brand-500 hover:text-brand-700"
          >
            <FiCopy />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click propagation
              router.push(`/admin/assignment/${row.original._id}`); // Navigate to assignment details page
            }}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <FiEye />
          </button>
          {/* Download Button component for each assignment */}
          <DownloadButton assignmentId={row.original._id} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={transformedAndSortedTests || []} // Data to be displayed in the table
      columns={columns} // Column configuration
      filters={filters} // Filter options for the table
    />
  );
};

export default TestsTable;
