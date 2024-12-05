"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutSearch'
import { FiDownload, FiSave, FiUpload,FiEye,FiTrash2  } from 'react-icons/fi';
import Card from '@/components/card/index';
import Modal from 'react-modal';
import GeneralUpload from './modals/GeneralUpload';
import LegalUpload from './modals/LegalUpload'; 
import { useRouter } from 'next/navigation';
import { 
  useGetGeneralDocumentsByStudentIdQuery, 
  useGetLegalDocumentsByStudentIdQuery, 
  useLazyDownloadGeneralDocumentQuery, 
  useLazyDownloadLegalDocumentQuery,
  useDeleteGeneralDocumentMutation,
  useDeleteLegalDocumentMutation,
} from '@/lib/features/students/studentsDocumentsApiSlice';
import StudentWelRecordsTable from './StudentWelRecordsTable';
import StudentResultsTable from './StudentsResultsTable';
import { useGenerateSorReportMutation } from '@/lib/features/sor/sorApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

import {useGetResultsByStudentIdQuery} from '@/lib/features/assignment/assignmentsResultsApiSlice';

const StudentDetailsTable = ({ studentId}) => {
  const [activeTab, setActiveTab] = useState('documents');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  const [triggerDownloadGeneralDocument] = useLazyDownloadGeneralDocumentQuery();
  const [triggerDownloadLegalDocument] = useLazyDownloadLegalDocumentQuery();
  const [deleteGeneralDocument] = useDeleteGeneralDocumentMutation();
  const [deleteLegalDocument] = useDeleteLegalDocumentMutation();
  const [assignmentResults, setAssignmentResults] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const router = useRouter();

  const [generateSorReport] = useGenerateSorReportMutation(); 

  const { data: assignmentResultsData = {}, isLoading: isLoadingResults, isError: isErrorResults } = useGetResultsByStudentIdQuery(studentId);

  useEffect(() => {
    if (assignmentResultsData.ids) {
      const results = assignmentResultsData.ids.map(id => assignmentResultsData.entities[id]);
      setAssignmentResults(results);
    }
  }, [assignmentResultsData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButtonClick = async () => {
    if (activeTab === 'WEL') {
      await document.getElementById('saveWelRecordsButton').click();
    } else if (activeTab === 'documents' || activeTab === 'legal') {
      setModalType(activeTab);
      setIsModalOpen(true);
    }
  };

  const handleDownloadSOR = async () => {
    try {
      await generateSorReport([studentId]);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      console.error('SOR Downloaded');
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
    tasks: assignmentResults,
  };

  const handleView = (resultId) => {
    router.push(`/admin/assignment/mark/${resultId}`);
  };

  console.log(assignmentResults)
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
          <div className="flex gap-2">
          <button onClick={() => handleDownload(row.original, 'general')} className="text-blue-500 hover:text-blue-700">
            <FiDownload />
          </button>
          <button onClick={() => handleViewDocument(row.original)} className="text-green-500 hover:text-green-700">
           <FiEye />
          </button>
          <button onClick={() => handleDelete(row.original, 'general')} className="text-red-500 hover:text-red-700">
              <FiTrash2 />
          </button>
        </div>
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
          <div className="flex gap-2">
          <button onClick={() => handleDownload(row.original, 'legal')} className="text-blue-500 hover:text-blue-700">
            <FiDownload />
          </button>
          <button onClick={() => handleViewDocument(row.original)} className="text-green-500 hover:text-green-700">
          <FiEye />
        </button>
        <button onClick={() => handleDelete(row.original, 'legal')} className="text-red-500 hover:text-red-700">
            <FiTrash2 />
        </button>
        </div>
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
      { Header: 'Title', accessor: 'assignment.title' },
      { 
        Header: 'Date', 
        accessor: (row) => {
          const date = new Date(row.dateTaken);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
      },
      { 
        Header: 'Outcome', 
        accessor: (row) => row.assignment.outcome.map(o => o.title).join(', '), 
      },
      { Header: 'Marks', accessor: 'scores'},
      {
        Header: 'Action',
        id: 'action',
        accessor: () => 'view',
        Cell: ({ row }) => (
          <button onClick={() => handleView(row.original._id)} className="text-blue-500 hover:text-blue-700">
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

  const handleDelete = (document, type) => {
    setSelectedDocument({ document, type });
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDocument) {
      try {
        if (selectedDocument.type === 'general') {
          await deleteGeneralDocument({ id: selectedDocument.document._id }).unwrap();
        } else {
          await deleteLegalDocument({ id: selectedDocument.document._id }).unwrap();
        }
        alert(`Document deleted successfully!`);
        setPopupOpen(false);
      } catch (error) {
        console.error('Failed to delete document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };


  const handleViewDocument = (item) => {
    const url = item.signedUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL is undefined');
      alert('The file URL is not available.');
    }
  };



  return (
    <>
  <div className="flex justify-center space-x-4">
        {isMobileView ? (
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className="py-2 px-4 rounded-lg focus:outline-none bg-gray-100"
          >
            {Object.keys(tables).map(tab => (
              <option key={tab} value={tab}>
                {tab === 'tasks' ? 'Tests/Tasks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          Object.keys(tables).map(tab => (
            <button
              key={tab}
              className={`py-2 px-4 rounded-lg focus:outline-none ${activeTab === tab ? 'bg-gray-300' : 'bg-gray-100'}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === 'tasks' ? 'Tests/Tasks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))
        )}
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

          {(activeTab === 'results') && (
            <button onClick={handleDownloadSOR} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              Generate SOR
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

      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedDocument ? selectedDocument.document.title : ''}
      />


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
