"use client";
import React, { useState } from "react";
import DataTable from "./DataTable"; // Import the DataTable component to display student data in a table format
import Card from "@/components/card/index"; // Import Card component to wrap the DataTable with styling
import { useRouter } from "next/navigation"; // Import useRouter hook for navigation
import { useSelector } from "react-redux"; // Import useSelector to access Redux store data
import {
  selectAllStudents,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "@/lib/features/students/studentsApiSlice"; // Import necessary functions from students API slice
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup"; // Import functions from intake groups API slice
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice"; // Import functions from campuses API slice
import { useGraduateStudentsMutation } from "@/lib/features/graduate/graduateApiSlice"; // Import function to graduate students from the graduate API slice

const GraduateStudentsTable = () => {
  const router = useRouter(); // Initialize router for page navigation

  // Fetch the data of students, intake groups, and campuses from the API
  const { data: studentsNormalized } = useGetStudentsQuery(); // Fetch all students data
  const students = useSelector(selectAllStudents); // Access students from the Redux store

  const { data: intakeGroupsNormalized } = useGetIntakeGroupsQuery(); // Fetch all intake groups data
  const { data: campusesNormalized } = useGetCampusesQuery(); // Fetch all campuses data

  // Access intake groups and campuses from the Redux store
  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  // Initialize mutation hooks to update student and graduate students
  const [updateStudent] = useUpdateStudentMutation(); // Mutation to update student information
  const [graduateStudents] = useGraduateStudentsMutation(); // Mutation to graduate students
  const [isGeneratingReport, setIsGeneratingReport] = useState(false); // State to track if report generation is in progress

  // Map intake groups and campuses to options for the filter dropdown
  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));

  // Define filters for intake group and campus
  const filters = [
    {
      id: "intakeGroup",
      options: intakeGroupOptions,
      defaultOption: "All Intakes", // Default filter option for intake group
    },
    {
      id: "campus",
      options: campusOptions,
      defaultOption: "All Campuses", // Default filter option for campus
    },
  ];

  // Transform students data to include the campus and intake group as comma-separated strings
  const transformedStudents = students.map((student) => ({
    ...student,
    campus: student.campus.map((group) => group.title).join(", "), // Combine campus titles into a single string
    intakeGroup: student.intakeGroup.map((group) => group.title).join(", "), // Combine intake group titles into a single string
  }));

  // Define the columns of the DataTable component
  const columns = [
    { Header: "Student No", accessor: "admissionNumber" },
    { Header: "First Name", accessor: "profile.firstName" },
    { Header: "Last Name", accessor: "profile.lastName" },
    { Header: "Date of Birth", accessor: "profile.dateOfBirth" },
    { Header: "Gender", accessor: "profile.gender" },
    { Header: "Mobile Number", accessor: "profile.mobileNumber" },
  ];

  // Handle changes to the student's current result (pass/fail)
  const handleCurrentResultsChange = async (id, value) => {
    try {
      await updateStudent({ id, formData: { currentResult: value } }).unwrap(); // Update the student's result via mutation
    } catch (error) {
      console.error("Failed to update student result:", error); // Log error if the update fails
    }
  };

  // Handle the graduation of selected students
  const handleGraduateStudents = async (selectedIds, passFailStatus) => {
    setIsGeneratingReport(true); // Set report generation state to true (indicating a process is ongoing)
    try {
      // Create an array of objects containing student IDs and their pass/fail statuses
      const graduatedStudents = selectedIds.map((id) => ({
        id,
        currentResult: passFailStatus.find((status) => status.id === id)?.value, // Get the current result (pass/fail) for each student
      }));
      console.log(graduatedStudents); // Log the graduated students data for debugging
      await graduateStudents(graduatedStudents).unwrap(); // Graduate the students via mutation
      alert("Students graduated successfully"); // Show success message
    } catch (error) {
      console.error("Failed to graduate students:", error); // Log error if the graduation fails
    } finally {
      setIsGeneratingReport(false); // Set report generation state back to false (indicating the process is complete)
    }
  };

  return (
    <Card>
      {/* Page Title */}
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Graduate Students</h1>
      </div>
      {/* DataTable Component to display student data */}
      <DataTable
        data={transformedStudents} // Pass the transformed students data
        columns={columns} // Pass the column definitions
        filters={filters} // Pass the filter options
        searchPlaceholder="Search students..." // Set the placeholder text for the search input
        onGraduateStudents={handleGraduateStudents} // Pass the function to handle graduation
        isGenerating={isGeneratingReport} // Pass the state indicating report generation status
        onPassFailChange={handleCurrentResultsChange} // Pass the function to handle result changes
      />
    </Card>
  );
};

export default GraduateStudentsTable;
