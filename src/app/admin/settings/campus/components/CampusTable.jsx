"use client"
import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import Card from '@/components/card/index';
import { useSelector } from 'react-redux';
import { useGetCampusesQuery, useDeleteCampusMutation, selectAllCampuses } from '@/lib/features/campus/campusApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const CampusTable = () => {   
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);


  const { data: campusesData, isLoading, isError, error } = useGetCampusesQuery();
  const [deleteCampus] = useDeleteCampusMutation();

  const handleAddClick = () => {
    router.push('/admin/settings/campus/add');
  };

  const campuses = useSelector(selectAllCampuses);

  const handleEdit = (campus) => {
    alert(`Editing campus: ${campus.title}`);
  };

  const handleRemove = async (campus) => {
    setSelectedCampus(campus);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCampus) {
      try {
        await deleteCampus({ id: selectedCampus.id }).unwrap();
        alert(`Campus "${selectedCampus.title}" deleted successfully!`);
        setPopupOpen(false);
      } catch (error) {
        console.error('Failed to delete campus: ', error);
        alert('Failed to delete campus. Please try again.');
      }
    }
  };

  const columns = [
    { Header: 'Campus', accessor: 'title' },
    { 
      Header: 'Actions',
      id: 'actions',
      accessor: () => 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:text-blue-700">
            <FiEdit />
          </button>
          <button onClick={() => handleRemove(row.original)} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading campuses: {error.message}</div>;
  }

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Campus</h1>
        <button onClick={handleAddClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          <FiPlus /> Add Campus
        </button>
      </div>
      <DataTable
        data={campuses}
        columns={columns}
        searchPlaceholder="Search campuses..."
      />
       <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedCampus ? selectedCampus.title : ''}
      />
    </Card>
  );
};

export default CampusTable;
