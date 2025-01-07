"use client";
import React, { useState } from "react";
import DataTable from "@/components/tables/BasicTableWithoutFilter";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Card from "@/components/card/index";
import { useSelector } from "react-redux";
import {
  useGetIntakeGroupsQuery,
  useDeleteIntakeGroupMutation,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";
import ConfirmDeletePopup from "@/components/popup/ConfirmDeletePopup";

const IntakeGroupTable = () => {
  const router = useRouter();

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState(null);

  const {
    data: intakeGroupData,
    isLoading,
    isError,
    error,
  } = useGetIntakeGroupsQuery();

  const handleEdit = (intakeGroup) => {
    router.push(`/admin/settings/intakegroup/edit/${intakeGroup.id}`);
  };

  const handleDelete = (intakeGroup) => {
    setSelectedIntakeGroup(intakeGroup);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIntakeGroup) {
      try {
        await deleteIntakeGroup({ id: selectedIntakeGroup.id }).unwrap();
        alert(
          `Intake Group "${selectedIntakeGroup.title}" deleted successfully!`
        );
        setPopupOpen(false);
      } catch (error) {
        console.error("Failed to delete intake group: ", error);
        alert("Failed to delete intake group. Please try again.");
      }
    }
  };

  const intakeGroups = useSelector(selectAllIntakeGroups);
  console.log(intakeGroups);
  const columns = [
    { Header: "Intake Group", accessor: "title" },
    {
      Header: "Campuses",
      accessor: (row) => row.campus.join(", "),
    },
    {
      Header: "Outcomes",
      accessor: (row) => row.outcome.join(", "),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Intake Groups</h1>
        <button
          onClick={() => router.push("/admin/settings/intakegroup/add")}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Intake Group
        </button>
      </div>
      <DataTable
        data={intakeGroups}
        columns={columns}
        searchPlaceholder="Search intake groups..."
      />

      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedIntakeGroup ? selectedIntakeGroup.title : ""}
      />
    </Card>
  );
};

export default IntakeGroupTable;
