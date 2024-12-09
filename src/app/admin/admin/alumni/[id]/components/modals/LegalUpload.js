"use client"; // Enables the component to run in a client-side environment, specific to Next.js

import { useState, useEffect } from "react"; // Import hooks for state and side effects
import { useAddNewLegalDocumentMutation } from "@/lib/features/students/studentsDocumentsApiSlice"; // Import the mutation hook for adding legal documents
import Card from "@/components/card"; // Import the Card component for styling and layout

const LegalUpload = ({ id }) => {
  // The component for uploading legal documents, receives the student id as a prop
  console.log(id); // Log the student id for debugging purposes

  // Mutation hook to add a new legal document
  const [addNewLegalDocument, { isLoading, isSuccess, isError, error }] =
    useAddNewLegalDocumentMutation();

  // State variables for form input fields
  const [file, setFile] = useState(null); // To store the selected file
  const [title, setTitle] = useState(""); // To store the title of the document
  const [description, setDescription] = useState(""); // To store the description of the document

  // Event handler to update the file state when a file is selected
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  // Reset the form fields when the document upload is successful
  useEffect(() => {
    if (isSuccess) {
      setTitle(""); // Reset the title field
      setDescription(""); // Reset the description field
      setFile(null); // Reset the file input
    }
  }, [isSuccess]); // This effect is triggered when the document upload is successful

  // Function to handle the form submission
  const onAddLegalDocumentClicked = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!isLoading) {
      // Check if the document upload is not in progress
      // Create a FormData object to send data, including the file
      const formData = new FormData();
      formData.append("title", title); // Add the title to the FormData
      formData.append("description", description); // Add the description to the FormData
      formData.append("studentId", id); // Add the student ID to associate the document with the correct student
      formData.append("file", file); // Add the file to the FormData

      try {
        // Attempt to upload the legal document using the mutation hook
        await addNewLegalDocument(formData).unwrap();
      } catch (err) {
        // Log any errors that occur during the document upload
        console.error("Failed to add document", err);
      }
    }
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold text-gray-800">Add Legal Document</h4>
      <form
        onSubmit={onAddLegalDocumentClicked}
        encType="multipart/form-data"
        className="space-y-4"
      >
        {/* Title input field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title} // Bind the title state to the input field
            onChange={(e) => setTitle(e.target.value)} // Update the title state when the user types
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required // Make this field required
          />
        </div>

        {/* Description input field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description} // Bind the description state to the textarea
            onChange={(e) => setDescription(e.target.value)} // Update the description state when the user types
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required // Make this field required
          />
        </div>

        {/* File upload input */}
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange} // Trigger file change handler when a file is selected
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            required // Make this field required
          />
        </div>

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-4"
          >
            Upload Document
          </button>
        </div>
      </form>
    </Card>
  );
};

export default LegalUpload;
