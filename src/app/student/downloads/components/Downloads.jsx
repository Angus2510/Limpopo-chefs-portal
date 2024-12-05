'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { FiDownload } from 'react-icons/fi';
import { useGetLearningMaterialsByStudentIdQuery, useLazyDownloadLearningMaterialQuery } from '@/lib/features/learningmaterial/learningMaterialApiSlice';

const DownloadsTable = ({ studentId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [typeFilter, setTypeFilter] = useState('');

  const { data: learningMaterialData, error, isLoading } = useGetLearningMaterialsByStudentIdQuery(studentId);

  const [triggerDownloadLearningMaterial] = useLazyDownloadLearningMaterialQuery();

  useEffect(() => {
    console.log('Learning materials data:', learningMaterialData);
  }, [learningMaterialData]);

  const columns = [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Date Uploaded', accessor: 'dateUploaded' },
    { Header: 'Available For', accessor: 'intakeGroup' },
    {
      Header: 'Action',
      id: 'action',
      accessor: () => 'download',
      Cell: ({ row }) => (
        <button onClick={() => handleDownload(row.original)} className="text-blue-500 hover:text-blue-700">
          <FiDownload />
        </button>
      )
    }
  ];

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


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const learningMaterialsArray = learningMaterialData ? Object.values(learningMaterialData.entities) : [];

  return (
    <DataTable
      data={learningMaterialsArray}
      columns={columns}
      searchPlaceholder="Search uploads..."
    />
  );
};

export default DownloadsTable;
