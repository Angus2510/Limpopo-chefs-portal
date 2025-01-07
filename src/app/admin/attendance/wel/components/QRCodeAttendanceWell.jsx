"use client";

import React, { useState } from "react";
import DataTable from "@/components/tables/BasicTable";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import Card from "@/components/card/index";
import { useSelector } from "react-redux";
import {
  useGetIntakeGroupsQuery,
  selectAllIntakeGroups,
} from "@/lib/features/intakegroup";
import {
  useGetCampusesQuery,
  selectAllCampuses,
} from "@/lib/features/campus/campusApiSlice";
import { useGetAllWelAttendanceQuery } from "@/lib/features/attendance/welAttendanceApiSlice";

const QRCodeAttendanceWell = () => {
  const router = useRouter();
  const [intakeGroupFilter, setIntakeGroupFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("");

  const {
    data: welAttendanceData,
    isLoading: welLoading,
    isError: welError,
    error: welFetchError,
  } = useGetAllWelAttendanceQuery();
  const {
    data: intakeGroupsNormalized,
    isLoading: intakeGroupsLoading,
    isError: intakeGroupsError,
    error: intakeGroupsFetchError,
    refetch: refetchIntakeGroups,
  } = useGetIntakeGroupsQuery();
  const {
    data: campusesNormalized,
    isLoading: campusesLoading,
    isError: campusesError,
    error: campusesFetchError,
    refetch: refetchCampuses,
  } = useGetCampusesQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  if (welLoading || intakeGroupsLoading || campusesLoading)
    return <div>Loading...</div>;
  if (welError || intakeGroupsError || campusesError)
    return (
      <div>
        Error:{" "}
        {welFetchError?.message ||
          intakeGroupsFetchError?.message ||
          campusesFetchError?.message}
      </div>
    );

  const transformedWelAttendance = welAttendanceData.map((record) => ({
    ...record,
    campuses: record.campuses.map((campus) => campus.title).join(", "),
    intakeGroups: record.intakeGroups.map((group) => group.title).join(", "),
  }));

  const handleButtonClick = () => {
    router.push("/admin/attendance/wel/add");
  };

  const intakeGroupOptions = intakeGroups.map((group) => ({
    label: group.title,
    value: group.title,
  }));
  const campusOptions = campuses.map((campus) => ({
    label: campus.title,
    value: campus.title,
  }));

  const filters = [
    {
      id: "intakeGroup",
      options: intakeGroupOptions,
      defaultOption: "All Intake Groups",
    },
    {
      id: "campus",
      options: campusOptions,
      defaultOption: "All Campuses",
    },
  ];

  const columns = [
    { Header: "Intake Groups", accessor: "intakeGroups" },
    { Header: "Campuses", accessor: "campuses" },
    { Header: "Date From", accessor: "dateFrom" },
    { Header: "Date To", accessor: "dateTo" },
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleButtonClick}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
          >
            <FiPlus /> Add Attendance
          </button>
        </div>
      </div>
      <DataTable
        data={transformedWelAttendance}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search Wel attendance..."
      />
    </Card>
  );
};

export default QRCodeAttendanceWell;
