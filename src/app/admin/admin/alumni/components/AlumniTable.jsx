"use client";

import React from "react";
import DataTable from "@/components/tables/BasicTable"; // Importing a custom DataTable component
import { useRouter } from "next/navigation"; // Importing Next.js router for navigation
import { FiEye, FiPlus } from "react-icons/fi"; // Importing icons from react-icons
import Card from "@/components/card/index"; // Importing a custom Card component

import { useSelector } from "react-redux"; // Importing Redux hook for accessing store
import {
  selectAllAlumni,
  useGetAlumniQuery,
} from "@/lib/features/alumni/alumniApiSlice"; // Importing alumni-related actions
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup/intakeGroupApiSlice"; // Importing intake group data fetching actions
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice"; // Importing campus data fetching actions

const AlumniTable = () => {
  const router = useRouter(); // Initializing Next.js router for navigation between pages

  // Fetching alumni data using the custom query hook (useGetAlumniQuery)
  const {
    data: alumniNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAlumniQuery();

  // Fetching intake groups and campuses data using custom query hooks
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

  // Accessing alumni, intake group, and campus data from the Redux store
  const alumni = useSelector(selectAllAlumni);
  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  // Handling the click on a row to navigate to the individual alumni page
  const handleRowClick = (alumni) => {
    router.push(`/admin/admin/alumni/${alumni._id}`);
  };

  // Handling the click on the "Add" button to navigate to the alumni add page
  const handleButtonClick = () => {
    router.push("/admin/admin/alumni/add");
  };

  // Transforming intake group data into options for the filter dropdown
  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));

  // Transforming campus data into options for the filter dropdown
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));

  // Defining the filter options
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

  // Transforming alumni data to include a readable format for campus and intake group fields
  const transformedAlumni = alumni.map((alumni) => ({
    ...alumni,
    campus: alumni.campus.map((group) => group.title).join(", "), // Joining campus titles into a string
    intakeGroup: alumni.intakeGroup.map((group) => group.title).join(", "), // Joining intake group titles into a string
  }));

  // Defining the columns for the data table
  const columns = [
    { Header: "Student No", accessor: "admissionNumber" },
    { Header: "First Name", accessor: "profile.firstName" },
    { Header: "Last Name", accessor: "profile.lastName" },
    { Header: "ID No", accessor: "profile.idNumber" },
    { Header: "Campus", accessor: "campus" },
    { Header: "Intake Group", accessor: "intakeGroup" },
    { Header: "Result", accessor: "currentResult" },
    // Adding an "Actions" column with a button for viewing the alumni's details
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation(); // Preventing the row click event from firing
              router.push(`/admin/admin/alumni/${row.original._id}`); // Navigating to the alumni detail page
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEye /> {/* View icon */}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      {" "}
      {/* Custom card component wrapping the table */}
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Alumni</h1> {/* Title of the page */}
      </div>
      <DataTable
        data={transformedAlumni || []} // Passing the transformed alumni data to the DataTable component
        columns={columns} // Defining the columns for the table
        filters={filters} // Passing filter options
        onRowClick={handleRowClick} // Handling row click to navigate to alumni details
      />
    </Card>
  );
};

export default AlumniTable;
