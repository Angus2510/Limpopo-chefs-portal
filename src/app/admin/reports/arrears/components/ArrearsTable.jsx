"use client";
import React from "react";
import DataTable from "@/components/tables/BasicTable";
import { useRouter } from "next/navigation";
import { FiDollarSign } from "react-icons/fi";
import Card from "@/components/card/index";
import { useSelector } from "react-redux";
import { useGetAccountsInArrearsQuery } from "@/lib/features/reports/reportsApiSlice";
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";

const ArrearsTable = () => {
  const router = useRouter();

  const {
    data: arrearsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAccountsInArrearsQuery();
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

  console.log("arrearsData:", arrearsData); // Log the arrearsData to inspect its structure

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

  const handleRowClick = (student) => {
    router.push(`/admin/students/${student.admissionNumber}`);
  };

  const transformedArrearsData = arrearsData
    ? Object.values(arrearsData.entities).map((report) => ({
        ...report,
        dueDate: report.dueDate
          ? new Date(report.dueDate).toLocaleDateString()
          : "",
      }))
    : [];

  const columns = [
    { Header: "Student No", accessor: "admissionNumber" },
    { Header: "First Name", accessor: "firstName" },
    { Header: "Last Name", accessor: "lastName" },
    { Header: "ID No", accessor: "idNumber" },
    { Header: "Arrears Amount", accessor: "totalAmount" },
    { Header: "Due Date", accessor: "dueDate" },
    { Header: "Campus", accessor: "campus" },
    { Header: "Intake Group", accessor: "intakeGroup" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
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
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Accounts in Arrears</h1>
      </div>
      <DataTable
        data={transformedArrearsData}
        columns={columns}
        filters={filters}
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default ArrearsTable;
