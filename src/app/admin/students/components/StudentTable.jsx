"use client";
import React from "react";
import DataTable from "@/components/tables/BasicTable";
import { useRouter } from "next/navigation";
import { FiEdit, FiDollarSign, FiPlus } from "react-icons/fi";
import Card from "@/components/card/index";

import { useSelector } from "react-redux";
import { selectAllStudents } from "@/lib/features/students/studentsApiSlice";
import { useGetStudentsQuery } from "@/lib/features/students/studentsApiSlice";

import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup/intakeGroupApiSlice";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";

const StudentsTable = () => {
  const router = useRouter();

  const {
    data: studentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudentsQuery();

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

  const students = useSelector(selectAllStudents);

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  const handleRowClick = (student) => {
    router.push(`/admin/students/${student._id}`);
  };

  const handleButtonClick = () => {
    router.push("/admin/students/add");
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
    { Header: "ID No", accessor: "profile.idNumber" },
    { Header: "Campus", accessor: "campus" },
    { Header: "Intake Group", accessor: "intakeGroup" },
    { Header: "Disable Reason", accessor: "inactiveReason" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/students/edit/${row.original._id}`);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/finance/collect/${row.original._id}`);
            }}
            className="text-green-500 hover:text-green-700"
          >
            <FiDollarSign />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-end items-center">
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
        >
          <FiPlus /> Add Student
        </button>
      </div>
      <DataTable
        data={transformedStudents || []}
        columns={columns}
        filters={filters}
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default StudentsTable;
