"use client";
import React, { useState } from "react";
import TestDetailsForm from "./TestDetailsForm"; // Import the form component for entering test details
import {
  useAddAssignmentMutation,
  useUploadFileMutation,
} from "@/lib/features/assignment/assignmentsApiSlice"; // Import API hooks for adding assignments and file uploads
import { useAddQuestionToAssignmentMutation } from "@/lib/features/assignment/questionsApiSlice"; // Import API hook for adding questions to assignments

function TestCreationPage({ id }) {
  // State to store the details of the test, including its questions, duration, and other metadata
  const [testDetails, setTestDetails] = useState({
    title: "",
    type: "",
    intakeGroups: [],
    availableFrom: "",
    students: [],
    campuses: "",
    outcomes: "",
    duration: 0,
    lecturer: id, // The lecturer is set to the ID passed as a prop
    questions: [], // Initially no questions
  });

  console.log(id); // Log the lecturer's ID for debugging

  // Mutations for adding an assignment and adding questions to that assignment
  const [addAssignment, { isLoading: isAssignmentLoading }] =
    useAddAssignmentMutation();
  const [addQuestionToAssignment, { isLoading: isQuestionLoading }] =
    useAddQuestionToAssignmentMutation();

  // Handle file upload for columns A and B in Match questions
  const handleFileUpload = async (file, assignmentId, questionId) => {
    console.log("Preparing to upload file:", file); // Log file upload start
    const formData = new FormData();
    formData.append("fileData", file); // Append the file data to the FormData object

    // Upload the file using the upload mutation and return the file URL once uploaded
    const result = await uploadFile({
      assignmentId,
      questionId,
      formData,
    }).unwrap();
    console.log("File upload result:", result); // Log the result of the file upload
    return result.url; // Return the URL of the uploaded file
  };

  // Handle the submission of the test creation form
  const handleSubmitTest = async () => {
    // Prepare the assignment data to send to the API
    const assignmentPayload = {
      title: testDetails.title,
      type: testDetails.type,
      intakeGroups: testDetails.intakeGroups,
      individualStudents: testDetails.students,
      campus: testDetails.campuses,
      outcome: testDetails.outcomes,
      availableFrom: testDetails.availableFrom,
      lecturer: testDetails.lecturer,
      duration: testDetails.duration,
    };

    try {
      // Add the assignment using the mutation
      const result = await addAssignment(assignmentPayload).unwrap();
      console.log("Assignment created:", result); // Log assignment creation

      const assignmentId = result._id; // Extract the assignment ID from the result

      // Loop through the questions and add them to the assignment
      for (const question of testDetails.questions) {
        console.log("Processing question:", question); // Log the question being processed

        // For Match type questions, upload the files for column A and B
        if (
          question.type === "Match" &&
          question.options &&
          question.options.length > 0
        ) {
          for (const option of question.options) {
            console.log("Processing option:", option); // Log the option being processed

            // If Column A is a file, upload it and update the option
            if (option.columnA instanceof File) {
              console.log("File A detected:", option.columnA); // Log detection of File A
              const urlA = await handleFileUpload(
                option.columnA,
                assignmentId,
                question._id
              );
              option.columnA = urlA; // Update the option with the uploaded file URL
            }
            // If Column B is a file, upload it and update the option
            if (option.columnB instanceof File) {
              console.log("File B detected:", option.columnB); // Log detection of File B
              const urlB = await handleFileUpload(
                option.columnB,
                assignmentId,
                question._id
              );
              option.columnB = urlB; // Update the option with the uploaded file URL
            }
          }
        }

        // For MultipleChoice questions, structure the options correctly before adding them
        if (
          question.type === "MultipleChoice" &&
          question.options &&
          question.options.length > 0
        ) {
          question.options = question.options.map((opt) => ({
            value: opt.value,
            isCorrect: opt.isCorrect,
          }));
        }

        // Add the question to the assignment using the mutation
        await addQuestionToAssignment({ assignmentId, question }).unwrap();
      }

      alert("Test/Task and questions added successfully!"); // Show success message after successful submission
    } catch (error) {
      console.error("Failed to create Test/task:", error); // Log error if the submission fails
      alert(
        "Failed to create Test/Task. Error: " +
          (error.data?.message || error.message)
      ); // Show error message
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Render the TestDetailsForm component to collect test details from the user */}
      <TestDetailsForm
        testDetails={testDetails} // Pass the current test details to the form
        updateTestDetail={setTestDetails} // Allow the form to update the test details in state
      />
      <button
        onClick={handleSubmitTest} // Trigger test submission when clicked
        className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${
          isAssignmentLoading || isQuestionLoading
            ? "disabled:bg-brand-300"
            : ""
        }`}
        disabled={isAssignmentLoading || isQuestionLoading} // Disable button if assignment or question is being loaded
      >
        Submit {/* Button label */}
      </button>
    </div>
  );
}

export default TestCreationPage;
