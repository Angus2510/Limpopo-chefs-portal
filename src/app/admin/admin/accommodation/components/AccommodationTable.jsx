"use client";

import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import Card from '@/components/card';
import { useGetAccommodationsQuery, useDeleteAccommodationMutation } from '@/lib/features/accommodation/accommodationApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const AccommodationTable = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [popupOpen, setPopupOpen] = useState(false); 
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  const { data: accommodationsData, isLoading, isError, error } = useGetAccommodationsQuery();
  const [deleteAccommodation] = useDeleteAccommodationMutation();

  const handleDeleteClick = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAccommodation) {
      try {
        await deleteAccommodation(selectedAccommodation._id).unwrap();
        alert(`Accommodation "${selectedAccommodation.roomNumber}" deleted successfully!`);
        setPopupOpen(false);
      } catch (error) {
        console.error('Failed to delete accommodation: ', error);
        alert('Failed to delete accommodation. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading accommodations: {error.message}</div>;
  }

  const accommodations = accommodationsData ? Object.values(accommodationsData.entities) : [];

  const columns = [
    { Header: 'Room Number', accessor: 'roomNumber' },
    { Header: 'Address', accessor: 'address' },
    {
      Header: 'Room Type Occupant Type',
      accessor: 'roomTypeOccupantType',
      Cell: ({ row }) => `${row.original.roomType} ${row.original.occupantType}`
    },
    {
      Header: 'Occupants',
      accessor: 'occupants',
      Cell: ({ row }) => {
        const occupants = row.original.occupants;
        return occupants && occupants.length > 0
          ? occupants.map(occupant => `${occupant.profile.firstName} ${occupant.profile.lastName}`).join(', ')
          : 'None';
      }
    },
    { Header: 'Cost Per Bed', accessor: 'costPerBed' },
    {
      Header: 'Availability',
      accessor: 'isAvailable',
      Cell: ({ row }) => row.original.isAvailable ? 'Available' : 'Not Available'
    },
    {
      Header: 'Actions',
      id: 'actions',
      accessor: () => 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button    onClick={(event) => {
              event.stopPropagation(); 
              router.push(`/admin/admin/accommodation/edit/${row.original._id}`);
            }} className="text-blue-500 hover:text-blue-700">
            <FiEdit />
          </button>
          <button onClick={() => handleDeleteClick(row.original)} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Accommodation</h1>
        <button onClick={() => router.push('/admin/admin/accommodation/add')} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          <FiPlus /> Add Accommodation
        </button>
      </div>
      <DataTable
        data={accommodations}
        columns={columns}
        searchPlaceholder="Search accommodation..."
      />
      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedAccommodation ? selectedAccommodation.roomNumber : ''}
      />
    </Card>
  );
};

export default AccommodationTable;
