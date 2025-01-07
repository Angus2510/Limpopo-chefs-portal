"use client";

import React, { useEffect } from "react";
import DataTable from "@/components/tables/BasicTableWithoutFilter";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import Card from "@/components/card/index";
import { useSelector } from "react-redux";
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";

const MarkAssignmentTable = () => {
  const router = useRouter();

  const {
    data: intakeGroupsNormalized,
    isLoading: intakeGroupsLoading,
    isError: intakeGroupsError,
  } = useGetIntakeGroupsQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups) ?? [];

  const handleRowClick = (intakeGroup) => {
    router.push(`/admin/assignment/mark/${intakeGroup.id}`);
  };

  useEffect(() => {
    console.log("Intake Groups:", intakeGroups);
  }, [intakeGroups]);

  const columns = [
    { Header: "Intake Group", accessor: "title" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleRowClick(row.original);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
        </div>
      ),
    },
  ];

  // Display loading or error states
  if (intakeGroupsLoading) {
    return <div>Loading...</div>;
  }

  if (intakeGroupsError) {
    return <div>Error loading data</div>;
  }

  return (
    <Card>
      <DataTable
        data={intakeGroups}
        columns={columns}
        searchPlaceholder="Search intake groups..."
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default MarkAssignmentTable;
