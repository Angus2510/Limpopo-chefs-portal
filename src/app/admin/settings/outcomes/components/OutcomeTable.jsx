'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Card from '@/components/card/index';
import { useSelector } from 'react-redux';
import { useGetAllOutcomesQuery, useDeleteOutcomeMutation } from '@/lib/features/outcome/outcomeApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const OutcomeTable = () => {
  const router = useRouter();
  const { data: outcomeData, isLoading, isError, error } = useGetAllOutcomesQuery();
  const [deleteOutcome] = useDeleteOutcomeMutation();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  useEffect(() => {
    if (outcomeData) {
      console.log('Outcome Data:', outcomeData);
    }
  }, [outcomeData]);

  const handleEdit = (outcome) => {
    router.push(`/admin/settings/outcomes/edit/${outcome.id}`);
  };

  const handleAddOutcome = () => {
    router.push('/admin/settings/outcomes/add');
  };

  const handleDelete = (outcome) => {
    setSelectedOutcome(outcome);
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedOutcome) {
      try {
        await deleteOutcome({ id: selectedOutcome.id }).unwrap();
        alert(`Outcome "${selectedOutcome.title}" deleted successfully!`);
        setPopupOpen(false);
      } catch (error) {
        console.error('Failed to delete outcome: ', error);
        alert('Failed to delete outcome. Please try again.');
      }
    }
  };

  // Mapping outcome data from entities and ids
  const outcomes = outcomeData
    ? outcomeData.ids.map((id) => ({
        ...outcomeData.entities[id],
        hidden: outcomeData.entities[id].hidden !== undefined ? outcomeData.entities[id].hidden : false,
      }))
    : [];

  const columns = [
    { Header: 'Outcomes', accessor: 'title' },
    { Header: 'Outcome Type', accessor: 'type' },
    { Header: 'Hidden', accessor: 'hidden', Cell: ({ value }) => (value ? 'Yes' : 'No') },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.original)} className="text-blue-500 hover:text-blue-700">
            <FiEdit />
          </button>
          <button onClick={() => handleDelete(row.original)} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Outcome Table</h1>
        <button onClick={handleAddOutcome} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          <FiPlus />
          Add Outcome
        </button>
      </div>
      <DataTable data={outcomes} columns={columns} searchPlaceholder="Search outcomes..." />
      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedOutcome ? selectedOutcome.title : ''}
      />
    </Card>
  );
};

export default OutcomeTable;
