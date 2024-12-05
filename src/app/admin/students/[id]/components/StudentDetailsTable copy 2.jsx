"use client"
import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutSearch'; // Adjust import path based on your file structure
import { FiDownload, FiPlus } from 'react-icons/fi';
import Card from '@/components/card/index';

const StudentDetailsTable = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleButtonClick = () => {
    // Handle button click action
  };

  // Dummy data for different types of uploads
  const tables = {
    documents: [
      // Placeholder data for documents
    ],
    legal: [
      // Placeholder data for legal documents
    ],
    WEL: [
      // Placeholder data for W.E.L (Fields Establishment)
    ],
    results: [
      // Placeholder data for results
    ],
    tasks: [ // Placeholder data for Test/Task
      // Add more test/task data as needed
    ],
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


  const columnsByTab = {
    documents: [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Date Uploaded', accessor: 'dateUploaded' },
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
    ],
    legal: [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Date Uploaded', accessor: 'dateUploaded' },
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
    tasks: [ // Define columns for Test/Task tab
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

  const handleDownload = (item) => {
    alert(`Downloading ${item.title}`);
  };

  const handleView = (item) => {
    // Handle view action
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
          <h1 className="text-xl font-bold">{activeTab === 'documents' ? 'Documents' : activeTab === 'legal' ? 'Legal Documents' : activeTab === 'WEL' ? 'W.E.L' : activeTab === 'results' ? 'Results' : 'Tests/Tasks'}</h1>
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
