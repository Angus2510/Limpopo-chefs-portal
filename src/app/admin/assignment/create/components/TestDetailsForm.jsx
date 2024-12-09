"use client";
import React, { useState } from "react";
import TestDetailsForm from "./TestDetailsForm"; // Import the form component to collect test details
import {
  useAddAssignmentMutation,
  useUploadFileMutation,
} from "@/lib/features/assignment/assignmentsApiSlice"; // Import API hooks for adding assignments and handling file uploads
import { useAddQuestionToAssignmentMutation } from "@/lib/features/assignment/questionsApiSlice"; // Import API hook for adding questions to an assignment

function TestCreationPage({ id }) {
  // State to hold the details of the test (title, type, intake groups, students, etc.)
  const [testDetails, setTestDetails] = useState({
    title: "",
    type: "",
    intakeGroups: [], // Array for intake groups
    availableFrom: "", // Start date for availability
    students: [], // Array for students assigned to the test
    campuses: "", // Campuses related to the test
    outcomes: "", // Expected outcomes of the test
    duration: 0, // Duration of the test in minutes
    lecturer: id, // The ID of the lecturer (received as a prop)
    questions: [], // Array to hold the questions of the test
  });

  console.log(id); // Log the lecturer ID for debugging purposes

  // API hooks for creating an assignment and adding questions to it
  const [addAssignment, { isLoading: isAssignmentLoading }] =
    useAddAssignmentMutation();
  const [addQuestionToAssignment, { isLoading: isQuestionLoading }] =
    useAddQuestionToAssignmentMutation();

  // Function to handle file uploads for Match type questions
  const handleFileUpload = async (file, assignmentId, questionId) => {
    console.log("Preparing to upload file:", file); // Log the file to be uploaded
    const formData = new FormData();
    formData.append("fileData", file); // Append the file to a FormData object

    // Use the upload mutation to upload the file and return the file URL
    const result = await uploadFile({
      assignmentId,
      questionId,
      formData,
    }).unwrap();
    console.log("File upload result:", result); // Log the result after file upload
    return result.url; // Return the URL of the uploaded file
  };

  // Function to handle the form submission for creating the test and adding questions
  const handleSubmitTest = async () => {
    // Prepare the assignment payload to be sent to the backend
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
      // Add the assignment to the backend using the mutation
      const result = await addAssignment(assignmentPayload).unwrap();
      console.log("Assignment created:", result); // Log the assignment creation result

      const assignmentId = result._id; // Extract the assignment ID from the result

      // Loop through the questions and add each to the assignment
      for (const question of testDetails.questions) {
        console.log("Processing question:", question); // Log the current question being processed

        // Handle Match type questions (upload files for columns A and B)
        if (
          question.type === "Match" &&
          question.options &&
          question.options.length > 0
        ) {
          for (const option of question.options) {
            console.log("Processing option:", option); // Log the current option

            // If Column A is a file, upload it and update the option with the file URL
            if (option.columnA instanceof File) {
              console.log("File A detected:", option.columnA); // Log file A detection
              const urlA = await handleFileUpload(
                option.columnA,
                assignmentId,
                question._id
              );
              option.columnA = urlA; // Update option column A with the uploaded file URL
            }

            // If Column B is a file, upload it and update the option with the file URL
            if (option.columnB instanceof File) {
              console.log("File B detected:", option.columnB); // Log file B detection
              const urlB = await handleFileUpload(
                option.columnB,
                assignmentId,
                question._id
              );
              option.columnB = urlB; // Update option column B with the uploaded file URL
            }
          }
        }

        // For MultipleChoice questions, ensure the options are structured correctly before sending
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

        // Add each question to the assignment using the mutation
        await addQuestionToAssignment({ assignmentId, question }).unwrap();
      }

      // If everything succeeds, show a success message
      alert("Test/Task and questions added successfully!");
    } catch (error) {
      console.error("Failed to create Test/task:", error); // Log any errors that occur
      // Display an error message if something goes wrong during the submission
      alert(
        "Failed to create Test/Task. Error: " +
          (error.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Render the TestDetailsForm component to collect and update test details */}
      <TestDetailsForm
        testDetails={testDetails} // Pass the current test details as a prop
        updateTestDetail={setTestDetails} // Pass the function to update test details
      />
      <button
        onClick={handleSubmitTest} // Trigger test creation on button click
        className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${
          isAssignmentLoading || isQuestionLoading
            ? "disabled:bg-brand-300"
            : ""
        }`}
        disabled={isAssignmentLoading || isQuestionLoading} // Disable the button if the assignment or questions are still being loaded
      >
        Submit {/* Button label */}
      </button>
    </div>
  );
}

export default TestCreationPage;
