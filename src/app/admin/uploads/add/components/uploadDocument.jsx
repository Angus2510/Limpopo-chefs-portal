"use client"
import { useState, useEffect } from 'react';
import { useRouter  } from "next/navigation";
import Card from "@/components/card";
import { useAddNewLearningMaterialMutation } from '@/lib/features/learningmaterial/learningMaterialApiSlice';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';

const UploadDocument = () => {
    const router = useRouter();

    const [addNewLearningMaterial, { isLoading, isSuccess, isError, error }] = useAddNewLearningMaterialMutation();

    const handleCancelButtonClick = () => {
        router.push('/admin/uploads/'); 
      };
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const newFileName = selectedFile.name.replace(/ /g, '_');
            const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
            setFile(renamedFile);
        }
    };
    // State variables for form fields
    const [title, setTitle] = useState('');
    const [intakeGroup, setIntakeGroup] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [description, setDescription] = useState('');
  
    // Handle file selection
    useEffect(() => {
        if (isSuccess) {
            router.push('/admin/uploads'); 
        }
    }, [isSuccess, router]);
    // Form submission handler
    const onAddLearningMaterialClikced = async (e) => { 
        e.preventDefault();
        if (!isLoading) {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('intakeGroup', intakeGroup);
        formData.append('uploadDate', uploadDate);
        formData.append('description', description);
        formData.append('uploadType', 'Study Material');
        formData.append('file', file);

        try {
            const result = await addNewLearningMaterial(formData).unwrap();
            console.log('Student added successfully', result);
        } catch (err) {
            console.error('Failed to add learning material', err);
        }
    }
    };

    // Rendering the component
    return (
        <Card className="bg-white dark:bg-dmgray-900 p-6 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Add Learning Material</h4>
            <p className="mt-2 text-base text-gray-600 dark:text-dmgray-200">Fill in the details below to upload a new document.</p>
            <form onSubmit={onAddLearningMaterialClikced} encType="multipart/form-data">
                <div className="space-y-4">
                    {/* Title input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dmgray-200">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6"
                            required
                        />
                    </div>
                    {/* Intake Group selection */}
                    <div>
                    <IntakeGroupSelect selectedIntakeGroups={intakeGroup} setSelectedIntakeGroups={setIntakeGroup} />
                    </div>
                    {/* Upload Date input */}
                    <div>
                        <label htmlFor="uploadDate" className="block text-sm font-medium text-gray-700 dark:text-dmgray-200">Upload Date</label>
                        <input
                            type="date"
                            id="uploadDate"
                            value={uploadDate}
                            onChange={e => setUploadDate(e.target.value)}
                             className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6"
                            required
                        />
                    </div>
                    {/* Description input */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dmgray-200">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                             className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6"
                            required
                        />
                    </div>
                    {/* File input */}
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-dmgray-200">Upload File</label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                            required
                        />
                    </div>
                </div>
                {/* Submit button */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
                    >
                        Upload Document
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelButtonClick}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default UploadDocument;
