"use client";

import React from "react";
import Banner from "./Banner"; // Importing the Banner component to display alumni's profile banner
import General from "./General"; // Importing the General component for alumni's general information
import EditBlock from "./EditBLock"; // Importing the EditBlock component to display editable block for alumni info
import StudentDetailsTable from "./StudentDetailsTable"; // Importing the table component to display detailed student results
import { useRouter } from "next/navigation"; // Importing Next.js router for navigation
import ActionList from "./ActionList"; // Importing the ActionList component for action items related to alumni

import { useGetAlumniByIdQuery } from "@/lib/features/alumni/alumniApiSlice"; // Importing the custom query hook to fetch alumni data

export default function Alumni({ alumniId }) {
  const router = useRouter(); // Initializing router object for navigation functionality

  // Fetching alumni data using the custom query hook
  const {
    data: alumniData, // The alumni data fetched from the API
    isFetching, // Indicates if the data is still being fetched
    isSuccess, // Indicates if the data was successfully fetched
    isError, // Indicates if there was an error fetching the data
    error, // Holds the error message if any
  } = useGetAlumniByIdQuery(alumniId); // Passing alumniId to fetch data for the specific alumni

  // Extracting the specific alumni's data from the fetched alumniData
  const alumni = alumniData?.entities[alumniId];

  // Handling the loading state when data is being fetched
  if (isFetching) {
    return <div>Loading...</div>;
  }

  // Handling the error state when there is an issue with fetching data
  if (isError) {
    return (
      <div>Error: {error?.data?.message || "Could not fetch the alumni"}</div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 mb-5">
      {/* Checking if the alumni data exists and rendering the components accordingly */}
      {alumni ? (
        <div>
          {/* First grid section displaying Banner and General information components */}
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
            <Banner
              name={alumni?.profile?.firstName || "N/A"} // Displaying alumni's first name or 'N/A' if not available
              avatar={alumni?.profile?.avatar} // Displaying alumni's avatar
              intakeGroup={alumni?.intakeGroup?.map((c) => c.title).join(", ")} // Joining intake group titles if available
              studentNo={alumni?.admissionNumber} // Displaying alumni's admission number
              campus={"Alumni"} // Static label for campus as 'Alumni'
            />
            <General
              result={alumni?.currentResult || "Fail"} // Displaying alumni's current result or 'Fail' if not available
              description={alumni?.profile?.description || " "} // Displaying alumni's description or a blank space if not available
              gender={alumni?.profile?.gender || "N/A"} // Displaying alumni's gender or 'N/A' if not available
              mobileNumber={alumni?.profile?.mobileNumber || "N/A"} // Displaying alumni's mobile number or 'N/A' if not available
              email={alumni?.email || "N/A"} // Displaying alumni's email or 'N/A' if not available
              idNumber={alumni?.profile?.idNumber || "N/A"} // Displaying alumni's ID number or 'N/A' if not available
              cityAndGuildNumber={alumni?.profile?.cityAndGuildNumber || "N/A"} // Displaying City and Guild number or 'N/A' if not available
            />
          </div>

          {/* Second grid section for editable block and action list */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <EditBlock
              text={alumni?.importantInformation || "N/A"}
              studentId={alumniId}
            />
            {/* Displaying the EditBlock component with alumni's important information */}
            <ActionList studentId={alumniId} />
            {/* Displaying the ActionList component for the alumni's actions */}
          </div>

          {/* Third section to display student details in a table format */}
          <div className="mt-5">
            <StudentDetailsTable studentId={alumniId} />
            {/* Displaying a table component to show student details (e.g., results) */}
          </div>
        </div>
      ) : (
        // If no alumni data is found, show a message
        <div>No alumni found.</div>
      )}
    </div>
  );
}
