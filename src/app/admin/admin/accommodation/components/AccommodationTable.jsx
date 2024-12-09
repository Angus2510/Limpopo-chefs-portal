"use client";

import React, { useState } from "react";
import DataTable from "@/components/tables/BasicTableWithoutFilter";
import { useRouter } from "next/navigation";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import Card from "@/components/card";
import {
  useGetAccommodationsQuery,
  useDeleteAccommodationMutation,
} from "@/lib/features/accommodation/accommodationApiSlice";
import ConfirmDeletePopup from "@/components/popup/ConfirmDeletePopup";

const AccommodationTable = () => {
  const router = useRouter(); // Used for programmatic navigation within Next.js
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [popupOpen, setPopupOpen] = useState(false); // State to manage the delete confirmation popup
  const [selectedAccommodation, setSelectedAccommodation] = useState(null); // State to store the accommodation selected for deletion

  // Fetching accommodations data from the API slice
  const {
    data: accommodationsData,
    isLoading,
    isError,
    error,
  } = useGetAccommodationsQuery();

  // Mutation to delete an accommodation
  const [deleteAccommodation] = useDeleteAccommodationMutation();

  // Handles delete button click and opens confirmation popup
  const handleDeleteClick = (accommodation) => {
    setSelectedAccommodation(accommodation); // Store the accommodation to be deleted
    setPopupOpen(true); // Open confirmation popup
  };

  // Handles the confirmation of delete action
  const handleConfirmDelete = async () => {
    if (selectedAccommodation) {
      try {
        await deleteAccommodation(selectedAccommodation._id).unwrap(); // Perform the delete action
        alert(
          `Accommodation "${selectedAccommodation.roomNumber}" deleted successfully!`
        );
        setPopupOpen(false); // Close the popup
      } catch (error) {
        console.error("Failed to delete accommodation: ", error);
        alert("Failed to delete accommodation. Please try again.");
      }
    }
  };

  // Display loading state if data is still being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Display error message if there's an error fetching data
  if (isError) {
    return <div>Error loading accommodations: {error.message}</div>;
  }

  // Extract accommodations data from the query response
  const accommodations = accommodationsData
    ? Object.values(accommodationsData.entities)
    : [];

  // Define table columns with headers and accessors
  const columns = [
    { Header: "Room Number", accessor: "roomNumber" },
    { Header: "Address", accessor: "address" },
    {
      Header: "Room Type Occupant Type", // Combines room and occupant types
      accessor: "roomTypeOccupantType",
      Cell: ({ row }) =>
        `${row.original.roomType} ${row.original.occupantType}`, // Render combined data
    },
    {
      Header: "Occupants", // List occupants in the room
      accessor: "occupants",
      Cell: ({ row }) => {
        const occupants = row.original.occupants;
        return occupants && occupants.length > 0
          ? occupants
              .map(
                (occupant) =>
                  `${occupant.profile.firstName} ${occupant.profile.lastName}`
              )
              .join(", ") // Concatenate names
          : "None"; // Display 'None' if no occupants
      },
    },
    { Header: "Cost Per Bed", accessor: "costPerBed" },
    {
      Header: "Availability", // Display room availability
      accessor: "isAvailable",
      Cell: ({ row }) =>
        row.original.isAvailable ? "Available" : "Not Available", // Conditional rendering
    },
    {
      Header: "Actions", // Edit and delete actions
      id: "actions",
      accessor: () => "actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          {/* Edit button */}
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click propagation
              router.push(
                `/admin/admin/accommodation/edit/${row.original._id}`
              ); // Navigate to edit page
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          {/* Delete button */}
          <button
            onClick={() => handleDeleteClick(row.original)}
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
      {/* Header with title and add button */}
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Accommodation</h1>
        <button
          onClick={() => router.push("/admin/admin/accommodation/add")} // Navigate to add accommodation page
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FiPlus /> Add Accommodation
        </button>
      </div>
      {/* Data table to display accommodations */}
      <DataTable
        data={accommodations} // Pass data to the table
        columns={columns} // Pass column definitions
        searchPlaceholder="Search accommodation..." // Placeholder for search input
      />
      {/* Confirmation popup for delete action */}
      <ConfirmDeletePopup
        isOpen={popupOpen} // Control popup visibility
        onClose={() => setPopupOpen(false)} // Close popup on cancel
        onConfirm={handleConfirmDelete} // Confirm delete action
        itemTitle={
          selectedAccommodation ? selectedAccommodation.roomNumber : ""
        } // Display room number in confirmation
      />
    </Card>
  );
};

export default AccommodationTable;
