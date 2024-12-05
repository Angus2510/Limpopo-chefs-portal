"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutSearch'; // Adjust import path based on your file structure
import { FiDownload, FiPlus } from 'react-icons/fi';
import Card from '@/components/card/index';
import { 
  useGetGeneralDocumentsByStudentIdQuery, 
  useGetLegalDocumentsByStudentIdQuery, 
  useLazyDownloadGeneralDocumentQuery, 
  useLazyDownloadLegalDocumentQuery 
} from '@/lib/features/students/studentsDocumentsApiSlice';

const StudentDetailsTable = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('documents');
  const [typeFilter, setTypeFilter] = useState('');
  const [triggerDownloadGeneralDocument] = useLazyDownloadGeneralDocumentQuery();
  const [triggerDownloadLegalDocument] = useLazyDownloadLegalDocumentQuery();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleButtonClick = () => {
    // Handle button click action
  };

  const applyFilters = (data) => {
    let filteredData = Array.isArray(data) ? [...data] : [];
    // Apply type filter
    if (typeFilter !== '') {
      filteredData = filteredData.filter(upload => upload.type === typeFilter);
    }
    return filteredData;
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
  };

  const { data: generalDocumentsData = {}, isLoading: isLoadingGeneral, isError: isErrorGeneral } = useGetGeneralDocumentsByStudentIdQuery(studentId);
  const { data: legalDocumentsData = {}, isLoading: isLoadingLegal, isError: isErrorLegal } = useGetLegalDocumentsByStudentIdQuery(studentId);

  useEffect(() => {
    if (isErrorGeneral) {
      console.error("Error fetching general documents:", isErrorGeneral);
    }
    if (isErrorLegal) {
      console.error("Error fetching legal documents:", isErrorLegal);
    }
  }, [generalDocumentsData, legalDocumentsData, isErrorGeneral, isErrorLegal]);

  const generalDocuments = generalDocumentsData.ids?.map(id => generalDocumentsData.entities[id]) || [];
  const legalDocuments = legalDocumentsData.ids?.map(id => legalDocumentsData.entities[id]) || [];

  const tables = {
    documents: generalDocuments,
    legal: legalDocuments,
    WEL: [], // Placeholder for W.E.L data
    results: [], // Placeholder for Results data
    tasks: [], // Placeholder for Tests/Tasks data
  };

  const columnsByTab = {
    documents: [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Date Uploaded', accessor: 'uploadDate' },
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'download',
        Cell: ({ row }) => (
          <button onClick={() => handleDownload(row.original, 'general')} className="text-blue-500 hover:text-blue-700">
            <FiDownload />
          </button>
        )
      }
    ],
    legal: [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Date Uploaded', accessor: 'uploadDate' },
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'download',
        Cell: ({ row }) => (
          <button onClick={() => handleDownload(row.original, 'legal')} className="text-blue-500 hover:text-blue-700">
            <FiDownload />
          </button>
        )
      }
    ],
    WEL: [
      { Header: 'Fields Establishment', accessor: 'fieldsEstablishment' },
      { Header: 'Start Date', accessor: 'startDate' },
      { Header: 'End Date', accessor: 'endDate' },
      { Header: 'Total Hours', accessor: 'totalHours' },
      { Header: 'Evaluation', accessor: 'evaluation' },
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'view',
        Cell: ({ row }) => (
          <button onClick={() => handleView(row.original)} className="text-blue-500 hover:text-blue-700">
            View
          </button>
        )
      }
    ],
    results: [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Test/Task', accessor: 'testTask' },
      { Header: 'Outcome', accessor: 'outcome' },
      { Header: 'Result', accessor: 'result' },
      { Header: 'Overall Outcome', accessor: 'overallOutcome' },
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'view',
        Cell: ({ row }) => (
          <button onClick={() => handleView(row.original)} className="text-blue-500 hover:text-blue-700">
            View
          </button>
        )
      }
    ],
    tasks: [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Outcome', accessor: 'outcome' },
      { Header: 'Marks', accessor: 'marks' },
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'view',
        Cell: ({ row }) => (
          <button onClick={() => handleView(row.original)} className="text-blue-500 hover:text-blue-700">
            View
          </button>
        )
      }
    ],
  };

  const handleDownload = async (item, type) => {
    try {
      const response = type === 'general'
        ? await triggerDownloadGeneralDocument(item.id)
        : await triggerDownloadLegalDocument(item.id);
      if (response.error) {
        console.error('Error downloading document:', response.error);
        alert('An error occurred while downloading the document.');
      } else {
        const url = response.data.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.documentUrl.split('/').pop());
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
    // Handle view action for W.E.L, Results, and Tests/Tasks
  };

  return (
    <>
      <div className="flex justify-center space-x-4">
        {Object.keys(tables).map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 rounded-lg focus:outline-none ${activeTab === tab ? 'bg-gray-300' : 'bg-gray-100'}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab === 'tasks' ? 'Tests/Tasks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <div className="mt-4 mb-4 flex justify-between items-center p-5">
          <h1 className="text-xl font-bold">
            {activeTab === 'documents' ? 'Documents' : activeTab === 'legal' ? 'Legal Documents' : activeTab === 'WEL' ? 'W.E.L' : activeTab === 'results' ? 'Results' : 'Tests/Tasks'}
          </h1>
          {(activeTab === 'documents' || activeTab === 'legal' || activeTab === 'WEL') && (
            <button onClick={handleButtonClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              <FiPlus /> Add {activeTab === 'documents' ? 'Document' : activeTab === 'legal' ? 'Legal Document' : activeTab === 'WEL' ? 'W.E.L' : activeTab === 'results' ? 'Result' : 'Test/Task'}
            </button>
          )}
        </div>
        <DataTable
          data={applyFilters(tables[activeTab])}
          columns={columnsByTab[activeTab]}
          searchPlaceholder={`Search ${activeTab}...`}
        />
      </Card> 
    </>
  );
};

export default StudentDetailsTable;
