"use client"; // Indicates that this is a client-side component
import React from "react";
import Banner from "./Banner";
import General from "./General";
import EditBlock from "./EditBLock";
import AccountInfo from "./AccountInfo";
import { useRouter } from "next/navigation";
import { useGetStudentByIdQuery } from "@/lib/features/students/studentsApiSlice";
import { useGetStudentFeesByIdQuery } from "@/lib/features/finance/financeApiSlice";
import StudentTable from "./StudentDetailsTable";

export default function Student({ studentId }) {
  const router = useRouter(); // Hook for navigation

  // Fetch student data by ID
  const {
    data: studentData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetStudentByIdQuery(studentId);

  // Fetch student fees by ID
  const {
    data: studentFees,
    isFetching: isFetchingFees,
    isSuccess: isSuccessFees,
    isError: isErrorFees,
    error: errorFees,
  } = useGetStudentFeesByIdQuery(studentId);

  // Extract student information from fetched data
  const student = studentData?.entities[studentId];

  // Extract fee amount and due date
  const amount = studentFees?.amount?.[0] || 0;
  const dueDate = studentFees?.dueDate?.[0]
    ? new Date(studentFees.dueDate[0]).toLocaleDateString()
    : "";

  // Show loading state while fetching data
  if (isFetching) {
    return <div>Loading...</div>;
  }
  // Show error message if fetching data fails
  if (isError) {
    return <div>Error: {error?.data?.message || "Could not fetch data"}</div>;
  }

  // Function to handle SOR (Statement of Results) download
  const handleDownloadSor = async () => {
    try {
      const response = await fetch(`/api/sor/${studentId}`, {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${student.profile.firstName}_SOR.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Failed to download SOR.");
      }
    } catch (error) {
      console.error("Error downloading SOR:", error);
      alert("An error occurred while downloading the SOR.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {student ? (
        <div>
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Banner
              name={student.profile.firstName}
              avatar={student.profile.avatar}
              intakeGroup={student.intakeGroup?.map((c) => c.title).join(", ")}
              studentNo={student.admissionNumber}
              campus={student.campus?.map((c) => c.title).join(", ")}
              arrears={amount}
              dueDate={dueDate}
            />
            <General
              accommodation={student.profile.accommodation}
              description={student.profile.description}
              gender={student.profile.gender}
              mobileNumber={student.profile.mobileNumber}
              email={student.email}
              idNumber={student.profile.idNumber}
              cityAndGuildNumber={student.profile.cityAndGuildNumber}
            />
            <EditBlock text={student.importantInformation} />
          </div>
          <div className="mt-5">
            {/* SOR Download Button */}
            <button
              onClick={handleDownloadSor}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
            >
              Download My SOR
            </button>
            <StudentTable studentId={studentId} />
          </div>
        </div>
      ) : (
        <div>No student found.</div>
      )}
    </div>
  );
}
