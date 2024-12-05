"use client"
import React, { useState } from 'react';
import DataTable from '@/components/tables/CheckTable';
import { useRouter } from 'next/navigation';
import { FiDownload, FiSearch, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import Card from '@/components/card/index';

import { useSelector } from 'react-redux';
import { selectAllLearningMaterials, useGetLearningMaterialsQuery, useDeleteMultipleLearningMaterialsMutation, useLazyDownloadLearningMaterialQuery } from '@/lib/features/learningmaterial/learningMaterialApiSlice';

const UploadsTable = () => {   
  const router = useRouter();

  const {
    data: learningMaterialNormalized,
    isLoading,
    isError,
    error, 
    refetch,
  } = useGetLearningMaterialsQuery();  

  const uploads = useSelector(selectAllLearningMaterials);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteMultipleLearningMaterials] = useDeleteMultipleLearningMaterialsMutation();

  const [triggerDownloadLearningMaterial] = useLazyDownloadLearningMaterialQuery();

  const handleDelete = async () => {
    try {
      await deleteMultipleLearningMaterials(selectedIds).unwrap();
      refetch();
      alert('Successfully deleted selected documents');
    } catch (error) {
      console.error('Error deleting documents:', error);
      alert('An error occurred while deleting the documents.');
    }
  };

  const handleButtonClick = () => {
    router.push('/admin/uploads/add');
  };

  const applyFilters = (data) => {
    let filteredData = [...data];

    // Apply type filter
    if (typeFilter !== '') {
      filteredData = filteredData.filter(upload => upload.type === typeFilter);
    }

    return filteredData;
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
  };

  const handleSelect = (id) => {
    setSelectedIds(prevIds => prevIds.includes(id) ? prevIds.filter(prevId => prevId !== id) : [...prevIds, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      console.log(uploads)
      setSelectedIds(uploads.map(upload => upload.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDownload = async (item) => {
    try {
      const response = await triggerDownloadLearningMaterial(item.id);
      if (response.error) {
        console.error('Error downloading document:', response.error);
        alert('An error occurred while downloading the document.');
      } else {
        const url = response.data.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.filePath.split('/').pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('An error occurred while downloading the document.');
    }
  };

  const handleView = (item) => {
    const url = item.signedUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL is undefined');
      alert('The file URL is not available.');
    }
  };


  const filters = [
    {
      id: 'type',
      value: typeFilter,
      onChange: handleTypeChange,
      options: [
        { label: 'PDF', value: 'PDF' },
        { label: 'Video', value: 'Video' },
        // Add more options as needed
      ],
      defaultOption: 'All Types'
    }
  ];

  const transformedUploads = uploads.map(uploads => ({
    ...uploads,
    intakeGroup: uploads.intakeGroup.map(group => group.title).join(', ')
  }));

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
  };

  console.log(uploads)
  const columns = [
    {
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <input
          type="checkbox"
          checked={selectedIds.length === uploads.length}
          onChange={handleSelectAll}
        />
      ),
      accessor: 'select',
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => handleSelect(row.original.id)}
        />
      )
    },
    { Header: 'Title', accessor: 'title' },
    { Header: 'Date Available', accessor: 'dateUploaded', Cell: ({ value }) => formatDate(value) },
    { Header: 'Available For', accessor: 'intakeGroup' },
    {
      Header: 'Actions',
      id: 'actions',
      accessor: () => 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => handleDownload(row.original)} className="text-blue-500 hover:text-blue-700">
            <FiDownload />
          </button>
          <button onClick={() => handleView(row.original)} className="text-green-500 hover:text-green-700">
            <FiEye />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <Card>
      <div className="mt-4 mb-4 flex justify-end items-center">
          <button onClick={handleButtonClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4">
            <FiPlus /> Add Learning Material
          </button>
        </div>
        <DataTable
          data={transformedUploads}
          columns={columns}
          filters={filters}
          searchPlaceholder="Search uploads..." 
        />
      </Card>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </button>
      </div>

    </>
  );
};

export default UploadsTable;
