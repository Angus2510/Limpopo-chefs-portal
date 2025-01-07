"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAttendanceQuery,
  useAddAttendanceMutation,
} from "@/lib/features/attendance/attendanceApiSlice";
import { useTable, usePagination } from "react-table";
import { FiSave, FiSearch, FiRefreshCw } from "react-icons/fi";
import Card from "@/components/card";
import { addDays, startOfWeek, format } from "date-fns";
import { useGetIntakeGroupsQuery } from "@/lib/features/intakegroup";
import { useGetCampusesQuery } from "@/lib/features/campus/campusApiSlice";
import IntakeGroupSelect from "@/components/select/singleIntakeGroupSelect";
import CampusSelect from "@/components/select/sinlgeCampusSelect";

const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), "yyyy-MM-dd")
  );
};

const AttendanceTable = () => {
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const {
    data: attendanceData,
    error,
    isLoading,
  } = useGetAttendanceQuery(
    {
      campus: selectedCampus,
      intakeGroup: selectedIntakeGroup,
      date: attendanceDate,
    },
    { skip: !selectedCampus || !selectedIntakeGroup || !attendanceDate }
  );

  const [addAttendance] = useAddAttendanceMutation();
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const { data: campusesData, isLoading: isLoadingCampuses } =
    useGetCampusesQuery();
  const { data: intakeGroupsData, isLoading: isLoadingIntakeGroups } =
    useGetIntakeGroupsQuery();

  // Log fetched data for debugging
  useEffect(() => {
    console.log("Campuses:", campusesData);
    console.log("Intake Groups:", intakeGroupsData);
  }, [campusesData, intakeGroupsData]);

  const campusOptions = campusesData
    ? campusesData.ids.map((id) => ({
        label: campusesData.entities[id].title,
        value: campusesData.entities[id]._id,
      }))
    : [];
  const intakeGroupOptions = intakeGroupsData
    ? intakeGroupsData.ids.map((id) => ({
        label: intakeGroupsData.entities[id].title,
        value: intakeGroupsData.entities[id]._id,
      }))
    : [];

  useEffect(() => {
    if (attendanceData && attendanceData.ids) {
      const loadedData = attendanceData.ids.map(
        (id) => attendanceData.entities[id]
      );
      setAttendanceRecords(loadedData);
    }
  }, [attendanceData]);

  const handleCampusChange = (e) => {
    setSelectedCampus(e.target.value);
  };

  const handleIntakeGroupChange = (e) => {
    setSelectedIntakeGroup(e.target.value);
  };

  const handleAttendanceChange = (studentId, date, status) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student === studentId && record.date === date
          ? { ...record, status }
          : record
      )
    );
  };

  const weekDates = useMemo(() => {
    if (attendanceDate) {
      return getWeekDates(attendanceDate);
    }
    return [];
  }, [attendanceDate]);

  const columns = useMemo(
    () => [
      {
        Header: "Student Number",
        accessor: "admissionNumber",
      },
      {
        Header: "Student Name",
        accessor: "firstName",
      },
      ...weekDates.map((date) => ({
        Header: date,
        accessor: date,
        Cell: ({ row }) => {
          const attendanceRecord = attendanceRecords.find(
            (record) =>
              record.student === row.original.student && record.date === date
          );
          const status = attendanceRecord?.status || "N";
          return (
            <select
              value={status === "N" ? "" : status}
              onChange={(e) =>
                handleAttendanceChange(
                  row.original.student,
                  date,
                  e.target.value || "N"
                )
              }
            >
              <option value="">Select</option>
              {["P", "A", "H", "AR", "WEL"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      })),
    ],
    [weekDates, attendanceRecords]
  );

  const data = useMemo(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) return [];
    const groupedData = {};
    attendanceRecords.forEach((record) => {
      if (!groupedData[record.student]) {
        groupedData[record.student] = { ...record };
      }
      groupedData[record.student][record.date] = record;
    });
    return Object.values(groupedData);
  }, [attendanceRecords]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    usePagination
  );

  const handleSave = async () => {
    const groupedByDate = attendanceRecords.reduce((acc, record) => {
      const { date, student, status } = record;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ student, status });
      return acc;
    }, {});

    const payload = {
      intakeGroupId: selectedIntakeGroup,
      campusId: selectedCampus,
      attendance: Object.entries(groupedByDate).map(([date, attendees]) => ({
        date,
        attendees,
      })),
    };

    try {
      await addAttendance(payload).unwrap();
      alert("Attendance saved successfully");
    } catch (error) {
      console.error("Failed to save attendance: ", error);
    }
  };

  return (
    <div>
      <Card className={"w-full pb-10 p-4 h-full"}>
        <div className="text-sm mb-4">
          <strong>Key:</strong> Present: P, Absent: A, Holiday: H, Absent with
          Reason: AR, W.E.L: Workplace
        </div>
        <div className="flex gap-4 mb-4">
          <CampusSelect
            selectedCampus={selectedCampus}
            setSelectedCampus={setSelectedCampus}
          />
          <IntakeGroupSelect
            selectedIntakeGroup={selectedIntakeGroup}
            setSelectedIntakeGroup={setSelectedIntakeGroup}
          />
          <div className="relative w-full">
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
              Date *
            </label>
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="flex-1 text-gray-700 bg-white border-none focus:ring-0"
              />
            </div>
          </div>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading attendance data</p>}

        <form className="mt-8 h-full overflow-x-auto">
          <table className="w-full text-sm text-gray-600" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id}
                      className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700"
                    >
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        {column.render("Header")}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="pt-[14px] pb-[20px]"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>

        <div className="pagination">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md"
          >
            {"<<"}
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md"
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md"
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md"
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </Card>
      <button
        onClick={handleSave}
        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-5"
      >
        <FiSave />
        Save
      </button>
    </div>
  );
};

export default AttendanceTable;
