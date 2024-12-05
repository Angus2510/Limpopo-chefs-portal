import Card from "@/components/card";
import React, { useState } from "react";
import { useUpdateImportantInformationMutation } from "@/lib/features/students/importantInformationApiSlice";

const EditBlock = ({ text, studentId }) => {
  const [importantInfo, setImportantInfo] = useState(text);
  const [updateImportantInformation, { isLoading }] = useUpdateImportantInformationMutation();

  const handleSave = async () => {
    try {
      console.log(studentId)
      console.log(importantInfo)
      await updateImportantInformation({ id: studentId, importantInformation: importantInfo }).unwrap();
      console.log('Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <Card className="w-full p-3">
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Important Information
        </h4>
      </div>

      <div className="px-2">
        <textarea
          className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
          placeholder="Enter important information here..."
          value={importantInfo}
          onChange={(e) => setImportantInfo(e.target.value)}
        ></textarea> 
      </div>
      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </Card>
  );
};

export default EditBlock;
