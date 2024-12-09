"use client";
import React, { useState } from "react"; // Importing React and useState hook
import { useRouter } from "next/navigation"; // Importing Next.js router for navigation
import Card from "@/components/card"; // Importing a custom Card component
import SingleStudentSelect from "@/components/select/singleStudentSelect"; // Importing the student selection component
import IntakeGroupSelect from "@/components/select/singleIntakeGroupSelect"; // Importing the intake group selection component
import { useChangeStudentIntakeGroupMutation } from "@/lib/features/changeStudentInakegroup/changeStudentIntakegroup"; // Importing the mutation hook for changing the student's intake group

const ChangeStudentIntakeGroupPage = () => {
  // Initializing state to hold selected student and intake group
  const router = useRouter(); // Initializing Next.js router for navigation
  const [selectedStudent, setSelectedStudent] = useState(""); // State to store selected student ID
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState(""); // State to store selected intake group ID
  const [changeStudentIntakeGroup, { isLoading }] =
    useChangeStudentIntakeGroupMutation(); // Hook to handle mutation of student intake group change

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing the default form submission behavior

    try {
      // Calling the mutation to change the student's intake group
      await changeStudentIntakeGroup({
        studentId: selectedStudent, // Passing the selected student's ID
        newIntakeGroupId: selectedIntakeGroup, // Passing the selected intake group's ID
      }).unwrap(); // Unwrapping the result to handle the response

      // Alerting success and navigating back to the student list page
      alert("Student intake group updated successfully!");
      router.push("/admin/students"); // Redirecting to the student list page
    } catch (error) {
      // Handling any errors that occur during the mutation
      console.error("Failed to update student intake group:", error);
      alert("Failed to update student intake group. Please try again."); // Showing an error alert
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      {" "}
      {/* Wrapping the form in a styled Card component */}
      <p className="mt-2 text-base text-gray-600">
        Select a student and a new intake group to update.
      </p>{" "}
      {/* Instructions for the user */}
      {/* Form for selecting the student and intake group */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Student selection component */}
          <SingleStudentSelect
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
          {/* Intake Group selection component */}
          <IntakeGroupSelect
            selectedIntakeGroup={selectedIntakeGroup}
            setSelectedIntakeGroup={setSelectedIntakeGroup}
          />
        </div>

        {/* Submit and Cancel buttons */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
            disabled={isLoading} // Disabling the button while the mutation is loading
          >
            {isLoading ? "Updating..." : "Update Intake Group"}{" "}
            {/* Changing button text based on loading state */}
          </button>

          {/* Cancel button to navigate back */}
          <button
            type="button"
            onClick={() => router.push("/admin/settings/student-intake-group")} // Navigating back to the settings page
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ChangeStudentIntakeGroupPage;
