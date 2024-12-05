"use client";
import { useState, useEffect } from 'react';
import { useAddNewGeneralDocumentMutation } from '@/lib/features/students/studentsDocumentsApiSlice';
import Card from "@/components/card";

const GeneralUpload = ({id}) => {
  const [addNewGeneralDocument, { isLoading, isSuccess, isError, error }] = useAddNewGeneralDocumentMutation();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setDescription('');
      setFile(null);
    }
  }, [isSuccess]);

  const onAddGeneralDocumentClicked = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('studentId', id);
      formData.append('file', file);

      try {
        await addNewGeneralDocument(formData).unwrap();
      } catch (err) {
        console.error('Failed to add document', err);
      }
    }
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold text-gray-800">Add General Document</h4>
      <form onSubmit={onAddGeneralDocumentClicked} encType="multipart/form-data" className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            required
          />
        </div>
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
