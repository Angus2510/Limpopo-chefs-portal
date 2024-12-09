"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/tables/BasicTableWithoutSearch"; // Importing the DataTable component
import { FiDownload, FiSave, FiUpload } from "react-icons/fi"; // Importing icons for download, save, and upload actions
import Card from "@/components/card/index"; // Importing Card component for wrapping content
import Modal from "react-modal"; // Importing Modal for document upload actions
import GeneralUpload from "./modals/GeneralUpload"; // Importing modal component for general document uploads
import LegalUpload from "./modals/LegalUpload"; // Importing modal component for legal document uploads
import {
  useGetGeneralDocumentsByStudentIdQuery,
  useGetLegalDocumentsByStudentIdQuery,
  useLazyDownloadGeneralDocumentQuery,
  useLazyDownloadLegalDocumentQuery,
} from "@/lib/features/students/studentsDocumentsApiSlice"; // API hooks for fetching documents and downloading
import StudentWelRecordsTable from "./StudentWelRecordsTable"; // Importing WEL records table component
import StudentResultsTable from "./StudentsResultsTable"; // Importing Students Results table component

// Main StudentDetailsTable component to display tabs and documents
const StudentDetailsTable = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState("documents"); // State to manage active tab (documents, legal, WEL, etc.)
  const [typeFilter, setTypeFilter] = useState(""); // State for filtering document types
  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing modal visibility
  const [modalType, setModalType] = useState(""); // State to determine which modal type to show (general, legal)
  const [triggerDownloadGeneralDocument] =
    useLazyDownloadGeneralDocumentQuery(); // Lazy-loaded query for downloading general documents
  const [triggerDownloadLegalDocument] = useLazyDownloadLegalDocumentQuery(); // Lazy-loaded query for downloading legal documents

  // Handles the tab change when switching between "documents", "legal", "WEL", etc.
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handles button clicks for specific actions (uploading or saving documents)
  const handleButtonClick = async () => {
    if (activeTab === "WEL") {
      await document.getElementById("saveWelRecordsButton").click(); // Trigger save WEL records action
    } else if (activeTab === "documents" || activeTab === "legal") {
      setModalType(activeTab); // Set the modal type based on the active tab
      setIsModalOpen(true); // Open the modal for document upload
    }
  };

  // Closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Applies filters to the document data based on typeFilter
  const applyFilters = (data) => {
    let filteredData = Array.isArray(data) ? [...data] : [];
    if (typeFilter !== "") {
      filteredData = filteredData.filter(
        (upload) => upload.type === typeFilter
      ); // Filter by type
    }
    return filteredData;
  };

  // Updates the type filter based on the selected value
  const handleTypeChange = (value) => {
    setTypeFilter(value);
  };

  // Fetching general and legal documents based on studentId
  const {
    data: generalDocumentsData = {},
    isLoading: isLoadingGeneral,
    isError: isErrorGeneral,
  } = useGetGeneralDocumentsByStudentIdQuery(studentId);
  const {
    data: legalDocumentsData = {},
    isLoading: isLoadingLegal,
    isError: isErrorLegal,
  } = useGetLegalDocumentsByStudentIdQuery(studentId);

  // Error handling for fetching documents
  useEffect(() => {
    if (isErrorGeneral) {
      console.error("Error fetching general documents:", isErrorGeneral);
    }
    if (isErrorLegal) {
      console.error("Error fetching legal documents:", isErrorLegal);
    }
  }, [generalDocumentsData, legalDocumentsData, isErrorGeneral, isErrorLegal]);

  // Extracting general and legal documents from the data
  const generalDocuments =
    generalDocumentsData.ids?.map((id) => generalDocumentsData.entities[id]) ||
    [];
  const legalDocuments =
    legalDocumentsData.ids?.map((id) => legalDocumentsData.entities[id]) || [];

  // Data tables by tab (documents, legal, WEL, etc.)
  const tables = {
    documents: generalDocuments, // Mapping general documents to the "documents" tab
    legal: legalDocuments, // Mapping legal documents to the "legal" tab
    WEL: [], // Placeholder for WEL records
    results: [], // Placeholder for student results
    tasks: [], // Placeholder for tasks
  };

  // Columns to be displayed in the tables based on the active tab
  const columnsByTab = {
    documents: [
      { Header: "Title", accessor: "title" }, // Column for document title
      { Header: "Description", accessor: "description" }, // Column for document description
      { Header: "Date Uploaded", accessor: "uploadDate" }, // Column for document upload date
      {
        Header: "Action",
        id: "action",
        accessor: () => "download", // Action for downloading documents
        Cell: ({ row }) => (
          <button
            onClick={() => handleDownload(row.original, "general")}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiDownload /> {/* Display download icon */}
          </button>
        ),
      },
    ],
    legal: [
      { Header: "Title", accessor: "title" },
      { Header: "Description", accessor: "description" },
      { Header: "Date Uploaded", accessor: "uploadDate" },
      {
        Header: "Action",
        id: "action",
        accessor: () => "download",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDownload(row.original, "legal")}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiDownload />
          </button>
        ),
      },
    ],
    results: [
      { Header: "Title", accessor: "title" },
      { Header: "Test/Task", accessor: "testTask" },
      { Header: "Outcome", accessor: "outcome" },
      { Header: "Result", accessor: "result" },
      { Header: "Overall Outcome", accessor: "overallOutcome" },
      {
        Header: "Action",
        id: "action",
        accessor: () => "view",
        Cell: ({ row }) => (
          <button
            onClick={() => handleView(row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        ),
      },
    ],
    tasks: [
      { Header: "Name", accessor: "name" },
      { Header: "Date", accessor: "date" },
      { Header: "Outcome", accessor: "outcome" },
      { Header: "Marks", accessor: "marks" },
      {
        Header: "Action",
        id: "action",
        accessor: () => "view",
        Cell: ({ row }) => (
          <button
            onClick={() => handleView(row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
            View
          </button>
        ),
      },
    ],
  };

  // Handles the document download action
  const handleDownload = async (item, type) => {
    try {
      // Trigger download based on the document type (general or legal)
      const response =
        type === "general"
          ? await triggerDownloadGeneralDocument(item.id)
          : await triggerDownloadLegalDocument(item.id);
      if (response.error) {
        console.error("Error downloading document:", response.error);
        alert("An error occurred while downloading the document.");
      } else {
        const url = response.data.url;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.documentUrl.split("/").pop()); // Set filename based on URL
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link element
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("An error occurred while downloading the document.");
    }
  };

  const handleView = (item) => {
    // Handle view action for W.E.L, Results, and Tests/Tasks
  };

  return (
    <>
      {/* Tab buttons for switching between documents, legal, WEL, results, and tasks */}
      <div className="flex justify-center space-x-4">
        {Object.keys(tables).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded-lg focus:outline-none ${
              activeTab === tab ? "bg-gray-300" : "bg-gray-100"
            }`}
            onClick={() => handleTabChange(tab)} // Change active tab
          >
            {tab === "tasks"
              ? "Tests/Tasks"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
            {/* Display the tab name */}
          </button>
        ))}
      </div>

      {/* Card containing the table and upload/save buttons */}
      <Card>
        <div className="mt-4 mb-4 flex justify-between items-center p-5">
          <h1 className="text-xl font-bold">
            {activeTab === "documents"
              ? "Documents"
              : activeTab === "legal"
              ? "Legal Documents"
              : activeTab === "WEL"
              ? "W.E.L"
              : activeTab === "results"
              ? "Results"
              : "Tests/Tasks"}
          </h1>
          {(activeTab === "documents" ||
            activeTab === "legal" ||
            activeTab === "WEL") && (
            <button
              onClick={handleButtonClick}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {activeTab === "WEL" ? <FiSave /> : <FiUpload />}{" "}
              {activeTab === "WEL" ? "Save W.E.L" : "Upload"}{" "}
              {/* Conditional button text */}
            </button>
          )}
        </div>
        {/* Display corresponding table based on active tab */}
        {activeTab === "WEL" ? (
          <StudentWelRecordsTable studentId={studentId} />
        ) : activeTab === "results" ? (
          <StudentResultsTable studentId={studentId} />
        ) : (
          <DataTable
            data={applyFilters(tables[activeTab])}
            columns={columnsByTab[activeTab]}
            searchPlaceholder={`Search ${activeTab}...`} // Search placeholder based on active tab
          />
        )}
      </Card>

      {/* Modal for uploading documents */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Upload Document Modal"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          {modalType === "documents" && <GeneralUpload id={studentId} />}{" "}
          {/* Display general upload modal */}
          {modalType === "legal" && <LegalUpload id={studentId} />}{" "}
          {/* Display legal upload modal */}
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>{" "}
          {/* Close modal button */}
        </div>
      </Modal>
    </>
  );
};

export default StudentDetailsTable;
