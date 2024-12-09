"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestDetailsForm from "./TestDetailsForm"; // Component for displaying the test details form
import Card from "@/components/card"; // Component for rendering a card (although it's not used in the current code)
import "react-datetime/css/react-datetime.css"; // Importing datetime CSS for the DateTime component (if used)

function DuplicateAssignmentPage({ id }) {
  // State to store the test details of the assignment
  const [testDetails, setTestDetails] = useState({
    title: "",
    type: "",
    intakeGroups: [],
    availableFrom: "",
    individualStudents: [],
    campus: [],
    outcome: [],
    duration: 0,
    lecturer: "",
    questions: [],
  });

  // State to store the original test details for comparison when duplicating
  const [originalTestDetails, setOriginalTestDetails] = useState(null);

  // State to manage loading status
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  // Use Next.js router to navigate after successful duplication
  const router = useRouter();

  // Fetch the assignment details when the component is mounted or when `id` changes
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`http://localhost:3500/assignments/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTestDetails(data); // Set the fetched test details to state
        setOriginalTestDetails(JSON.parse(JSON.stringify(data))); // Save a deep copy of the original details for comparison
        setIsFetching(false); // Stop loading
      } catch (error) {
        console.error("Failed to fetch the assignment:", error);
        setIsFetching(false); // Stop loading on error
      }
    };

    fetchAssignment(); // Call the function to fetch assignment data
  }, [id]);

  // Handle file upload for questions
  const handleFileUpload = async (file, assignmentId, questionId) => {
    const formData = new FormData();
    formData.append("fileData", file);

    const response = await fetch(
      `http://localhost:3500/assignments/upload?assignmentId=${assignmentId}&questionId=${questionId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${errorText}`);
    }

    const result = await response.json();
    return result.url; // Return the uploaded file's URL
  };

  // Handle the creation of a new duplicated assignment
  const handleCreateAssignment = async () => {
    setIsUpdating(true); // Set updating flag to true to show loading state
    const assignmentPayload = {
      title: testDetails.title,
      type: testDetails.type,
      intakeGroups: testDetails.intakeGroups,
      individualStudents: testDetails.individualStudents,
      campus: testDetails.campus,
      outcome: testDetails.outcome,
      availableFrom: testDetails.availableFrom,
      lecturer: testDetails.lecturer,
      duration: testDetails.duration,
    };

    try {
      // Send POST request to create the duplicated assignment
      const response = await fetch(`http://localhost:3500/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentPayload), // Send the assignment data in JSON format
      });

      if (!response.ok) {
        throw new Error("Failed to create the assignment");
      }

      const newAssignment = await response.json(); // Get the newly created assignment
      await handleQuestionUpdates(newAssignment._id); // Update the questions for the new assignment
      alert("Duplicate assignment created successfully!"); // Show success message
      router.push(`/admin/assignment/${newAssignment._id}`); // Redirect to the new assignment's page
    } catch (error) {
      alert("Failed to create duplicate assignment. Error: " + error.message); // Show error message if creation fails
    } finally {
      setIsUpdating(false); // Reset updating flag to false
    }
  };

  // Handle updates for questions in the duplicated assignment
  const handleQuestionUpdates = async (newAssignmentId) => {
    const assignmentId = newAssignmentId;

    // Loop through each question and duplicate it
    for (const question of testDetails.questions) {
      const newQuestion = { ...question };
      delete newQuestion._id; // Remove the original question's _id for the new question

      // If the question type is 'Match', handle the options (which could be file uploads)
      if (
        question.type === "Match" &&
        question.options &&
        question.options.length > 0
      ) {
        for (const option of newQuestion.options) {
          const originalQuestion = originalTestDetails.questions.find(
            (q) => q._id === question._id
          );
          const originalOption = originalQuestion?.options.find(
            (opt) => opt._id === option._id
          );

          // Handle file upload for columnA and columnB in matching question
          if (option.columnA instanceof File) {
            if (
              !originalOption ||
              option.columnA.name !== originalOption.columnA.split("/").pop()
            ) {
              const urlA = await handleFileUpload(
                option.columnA,
                assignmentId,
                question._id
              );
              option.columnA = urlA; // Set the new file URL
            }
          } else if (typeof option.columnA === "string") {
            option.columnA = originalOption?.columnA || option.columnA; // Use original columnA value if it's not a file
          }

          if (option.columnB instanceof File) {
            if (
              !originalOption ||
              option.columnB.name !== originalOption.columnB.split("/").pop()
            ) {
              const urlB = await handleFileUpload(
                option.columnB,
                assignmentId,
                question._id
              );
              option.columnB = urlB; // Set the new file URL
            }
          } else if (typeof option.columnB === "string") {
            option.columnB = originalOption?.columnB || option.columnB; // Use original columnB value if it's not a file
          }
        }
      }

      // If the question type is 'MultipleChoice', map options to only include value and isCorrect
      if (
        question.type === "MultipleChoice" &&
        question.options &&
        question.options.length > 0
      ) {
        newQuestion.options = newQuestion.options.map((opt) => ({
          value: opt.value,
          isCorrect: opt.isCorrect,
        }));
      }

      // Send POST request to add the question to the new assignment
      const questionResponse = await fetch(
        `http://localhost:3500/assignments/${assignmentId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuestion),
        }
      );

      if (!questionResponse.ok) {
        throw new Error("Failed to add question");
      }
    }
  };

  // Display loading state if data is still being fetched
  if (isFetching) {
    return <div>Loading...</div>;
  }

  // Render the page for duplicating the assignment
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Duplicate Assignment</h1>
      {/* Render the form for editing the test details */}
      <TestDetailsForm
        testDetails={testDetails}
        updateTestDetail={setTestDetails} // Function to update test details in the state
      />
      {/* Button to submit the duplicated assignment */}
      <button
        onClick={handleCreateAssignment}
        className={`mt-4 px-4 py-2 bg-brand-500 text-white rounded ${
          isUpdating || isQuestionLoading ? "disabled:bg-brand-300" : ""
        }`}
        disabled={isUpdating || isQuestionLoading} // Disable button if updating or question loading
      >
        Submit Duplicate Assignment
      </button>
    </div>
  );
}

export default DuplicateAssignmentPage;
