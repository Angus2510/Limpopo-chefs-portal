"use client";

import { useState, useEffect } from "react";
import { useAddNewGeneralDocumentMutation } from "@/lib/features/students/studentsDocumentsApiSlice"; // Importing the mutation hook for adding new documents
import Card from "@/components/card"; // Importing a Card component for UI layout

const GeneralUpload = ({ id }) => {
  // Component for uploading general documents, receives student id as a prop
  // Hook for the mutation to add a new general document
  const [addNewGeneralDocument, { isLoading, isSuccess, isError, error }] =
    useAddNewGeneralDocumentMutation();

  // State variables to store form input values
  const [file, setFile] = useState(null); // Stores the selected file
  const [title, setTitle] = useState(""); // Stores the document title
  const [description, setDescription] = useState(""); // Stores the document description

  // Event handler to update the file state when a file is selected
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Setting the file selected by the user
  };

  // Reset form fields when document is successfully uploaded
  useEffect(() => {
    if (isSuccess) {
      setTitle(""); // Clear the title field
      setDescription(""); // Clear the description field
      setFile(null); // Reset the file selection
    }
  }, [isSuccess]); // Trigger this effect when the mutation is successful

  // Handler for submitting the form
  const onAddGeneralDocumentClicked = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!isLoading) {
      // Check if the document upload is not in progress
      const formData = new FormData(); // Create a new FormData object to handle the file upload
      formData.append("title", title); // Append the title to the form data
      formData.append("description", description); // Append the description to the form data
      formData.append("studentId", id); // Append the student id to associate the document with the correct student
      formData.append("file", file); // Append the selected file to the form data

      try {
        // Attempt to upload the document using the mutation hook
        await addNewGeneralDocument(formData).unwrap();
      } catch (err) {
        console.error("Failed to add document", err); // Log any errors that occur during the upload process
      }
    }
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold text-gray-800">Add General Document</h4>
      <form
        onSubmit={onAddGeneralDocumentClicked}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title state on change
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
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
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update description state on change
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
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
            onChange={handleFileChange} // Trigger file change handler
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            required
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

export default GeneralUpload;
