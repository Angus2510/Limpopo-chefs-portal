"use client";

import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import Card from '@/components/card/index';
import { useSelector } from 'react-redux';
import { useGetQualificationsQuery, useDeleteQualificationMutation, selectAllQualifications } from '@/lib/features/qualification/qualificationApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const QualificationTable = () => {   
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);

  const { data: qualificationsData, isLoading, isError, error } = useGetQualificationsQuery();
  const [deleteQualification] = useDeleteQualificationMutation();

  const handleAddClick = () => {
    router.push('/admin/settings/qualification/add');
  };

  const qualifications = useSelector(selectAllQualifications);

  const handleEdit = (qualification) => {
    alert(`Editing qualification: ${qualification.title}`);
  };

  const handleRemove = async (qualification) => {
    setSelectedQualification(qualification);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedQualification) {
      try {
        await deleteQualification({ id: selectedQualification.id }).unwrap();
        alert(`Qualification "${selectedQualification.title}" deleted successfully!`);
        setPopupOpen(false);
      } catch (error) {
        console.error('Failed to delete qualification: ', error);
        alert('Failed to delete qualification. Please try again.');
      }
    }
  };

  const columns = [
    { Header: 'Qualification', accessor: 'title' },
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
    return <div>Error loading qualifications: {error.message}</div>;
  }

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Qualification</h1>
        <button onClick={handleAddClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          <FiPlus /> Add Qualification
        </button>
      </div>
      <DataTable
        data={qualifications}
        columns={columns}
        searchPlaceholder="Search qualifications..."
      />
       <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedQualification ? selectedQualification.title : ''}
      />
    </Card>
  );
};

export default QualificationTable;
