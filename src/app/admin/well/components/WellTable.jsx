"use client"
import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import Card from '@/components/card/index';
import { FiPlus, FiTrash2} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectAllWels, useGetWelQuery, useDeleteWelMutation } from '@/lib/features/wel/welApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const WellTable = () => {
  const router = useRouter();

  const{
    data:welNormalized,
    isLoading,
    isError,
    error,
    refetch,
  }= useGetWelQuery();

  
  const wellData = useSelector(selectAllWels);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [accommodationFilter, setAccommodationFilter] = useState('');

  const [deleteWel] = useDeleteWelMutation();

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedWel, setSelectedWel] = useState(null);

  const handleRowClick = (wel) => {
    router.push(`/admin/well/${wel._id}`);
  };

  const handleButtonClick = () => {
    router.push('/admin/well/add');
  };



  const handleDelete = async () => {
    if (selectedWel) {
      try {
        await deleteWel(selectedWel._id).unwrap();
        alert(`W.E.L "${selectedWel.title}" deleted successfully!`);
        setPopupOpen(false);
        refetch(); 
      } catch (error) {
        console.error('Failed to delete W.E.L: ', error);
        alert('Failed to delete W.E.L. Please try again.');
      }
    }
  };

  const handleDeleteClick = (wel) => {
    setSelectedWel(wel);
    setPopupOpen(true);
  };


  const filters = [
    {
      id: 'accommodation',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
      defaultOption: 'Has Accommodations'
    },
    {
      id: 'available',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultOption: 'Is available'
    }
  ];

  const columns = [
    { Header: 'Establishment Name', accessor: 'title' },
    { Header: 'Location', accessor: 'location' },
    { 
      Header: 'Accommodation', 
      accessor: 'accommodation',
      Cell: ({ value }) => (value ? 'Yes' : 'No')
    },
    { 
      Header: 'Available', 
      accessor: 'available',
      Cell: ({ value }) => (value === true ? 'Yes' : 'No')
    },
    { Header: 'Note', accessor: 'note' },
    {
      Header: 'Actions',
      id: 'actions',
      accessor: () => 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={(event) =>{
              event.stopPropagation(); 
              handleDeleteClick(row.original)}}
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
    <div className="mt-4 mb-4 flex justify-end items-center">
      <button onClick={handleButtonClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4">
        <FiPlus /> Add W.E.L
      </button>
    </div>
    <DataTable
      data={wellData}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search well data..."
      onRowClick={handleRowClick}
    />
     <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleDelete}
        itemTitle={selectedWel ? selectedWel.title : ''}
      />
    </Card>
  );
};

export default WellTable;
