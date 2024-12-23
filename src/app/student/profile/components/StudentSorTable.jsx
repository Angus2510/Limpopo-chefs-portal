"use client";
import React, { useState, useEffect } from "react";
import StudentDataTable from "./StudentDataTable";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentStudent } from "@/lib/features/students/studentsApiSlice"; // Assuming we have a selector to fetch the current logged-in student
import { useGetStudentQuery } from "@/lib/features/students/studentsApiSlice"; // Query hook to fetch student data
import { useGenerateSorReportMutation } from "@/lib/features/sor/sorApiSlice";

const StudentSorTable = () => {
  const router = useRouter();
  const currentStudent = useSelector(selectCurrentStudent); // Get the current logged-in student
  const studentId = currentStudent?.id; // Extract the student ID

  const [generateSorReport, { isLoading: isGenerating }] =
    useGenerateSorReportMutation();

  // Function to handle SOR download
  const handleDownloadSor = async () => {
    if (!studentId) {
      console.error("Student ID is undefined");
      return;
    }

    try {
      const response = await generateSorReport(studentId).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${currentStudent.profile.firstName}_SOR.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating SOR:", error);
      alert("An error occurred while generating the SOR.");
    }
  };

  return (
    <div>
      <button
        onClick={handleDownloadSor}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Download My SOR"}
      </button>
      <StudentDataTable studentId={studentId} />
    </div>
  );
};

export default StudentSorTable;
