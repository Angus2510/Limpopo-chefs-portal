"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutSearch'
import { FiDownload, FiSave, FiUpload } from 'react-icons/fi';
import Card from '@/components/card/index';
import Modal from 'react-modal';
import GeneralUpload from './modals/GeneralUpload';
import LegalUpload from './modals/LegalUpload'; 
import { 
  useGetGeneralDocumentsByStudentIdQuery, 
  useGetLegalDocumentsByStudentIdQuery, 
  useLazyDownloadGeneralDocumentQuery, 
  useLazyDownloadLegalDocumentQuery 
} from '@/lib/features/students/studentsDocumentsApiSlice';
import StudentWelRecordsTable from './StudentWelRecordsTable';
import StudentResultsTable from './StudentsResultsTable';

// Modal.setAppElement('#__next');

const StudentDetailsTable = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('documents');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [triggerDownloadGeneralDocument] = useLazyDownloadGeneralDocumentQuery();
  const [triggerDownloadLegalDocument] = useLazyDownloadLegalDocumentQuery();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleButtonClick = async () => {
    if (activeTab === 'WEL') {
      await document.getElementById('saveWelRecordsButton').click();
    } else if (activeTab === 'documents' || activeTab === 'legal') {
      setModalType(activeTab);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const applyFilters = (data) => {
    let filteredData = Array.isArray(data) ? [...data] : [];
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
    WEL: [],
    results: [],
    tasks: [],
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
              {activeTab === 'WEL' ? <FiSave /> : <FiUpload />} {activeTab === 'WEL' ? 'Save W.E.L' : 'Upload'}
            </button>
          )}
        </div>
        {activeTab === 'WEL' ? (
          <StudentWelRecordsTable studentId={studentId} />
        ): activeTab === 'results' ? (
          <StudentResultsTable studentId={studentId} />
        ) : (
          <DataTable
            data={applyFilters(tables[activeTab])}
            columns={columnsByTab[activeTab]}
            searchPlaceholder={`Search ${activeTab}...`}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Upload Document Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          {modalType === 'documents' && <GeneralUpload id={studentId} />}
          {modalType === 'legal' && <LegalUpload id={studentId} />}
          <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </Modal>
    </>
  );
};

export default StudentDetailsTable;
