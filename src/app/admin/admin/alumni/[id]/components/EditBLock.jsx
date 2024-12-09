import Card from "@/components/card"; // Importing the Card component for layout
import React, { useState } from "react"; // Importing React and useState hook
import { useUpdateImportantInformationMutation } from "@/lib/features/students/importantInformationApiSlice"; // Importing mutation hook for updating important information

// The EditBlock component takes in initial text and studentId as props to display and update important information.
const EditBlock = ({ text, studentId }) => {
  // State to manage the text input by the user
  const [importantInfo, setImportantInfo] = useState(text);

  // Destructuring the mutation hook to update important information
  const [updateImportantInformation, { isLoading }] =
    useUpdateImportantInformationMutation();

  // Function to handle saving the updated important information
  const handleSave = async () => {
    try {
      console.log(studentId); // Log the student ID for debugging
      console.log(importantInfo); // Log the updated important information for debugging

      // Trigger the mutation to update the important information for the student
      await updateImportantInformation({
        id: studentId,
        importantInformation: importantInfo,
      }).unwrap();

      console.log("Student updated successfully"); // Log success message
    } catch (error) {
      console.error("Error updating student:", error); // Log error if update fails
    }
  };

  return (
    <Card className="w-full p-3">
      {" "}
      {/* Card component to wrap the content */}
      <div className="mt-2 mb-8 w-full">
        {" "}
        {/* Section for the header */}
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Important Information
        </h4>
      </div>
      {/* Textarea for inputting the important information */}
      <div className="px-2">
        <textarea
          className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
          placeholder="Enter important information here..."
          value={importantInfo} // Bind the textarea value to the state
          onChange={(e) => setImportantInfo(e.target.value)} // Update state as user types
        ></textarea>
      </div>
      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
          onClick={handleSave} // Call the handleSave function on click
          disabled={isLoading} // Disable the button while the save operation is in progress
        >
          {isLoading ? "Saving..." : "Save"}{" "}
          {/* Display loading text if isLoading is true */}
        </button>
      </div>
    </Card>
  );
};

export default EditBlock;
