"use client";
import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import { FiDownload } from "react-icons/fi";
import Card from "@/components/card";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";
import Dropdown from "@/components/dropdown";

type RowData = {
  id: string;
  [key: string]: any;
};

type Props = {
  columns: any[];
  studentData: RowData; // Pass single student's data
  isGenerating?: boolean;
};

const StudentDataTable: React.FC<Props> = ({
  columns,
  studentData,
  isGenerating,
}) => {
  const [isTableReady, setTableReady] = useState(false);

  useEffect(() => {
    setTableReady(true);
  }, []);

  // Only display the student's data as a single row
  const data = [studentData]; // Wrap the single student's data in an array

  const exportOptions = [
    {
      name: "Excel",
      action: () => exportToExcel(columns, data),
    },
    {
      name: "PDF",
      action: () => exportToPDF(columns, data),
    },
  ];

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  if (!isTableReady) return null;

  return (
    <Card className={"w-full pb-10 p-4 h-full"}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-start">
          <Dropdown
            button={<FiDownload className="text-xl cursor-pointer" />}
            className={"py-2 top-8 -left-[180px] w-max"}
          >
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="flex flex-col p-4">
                {exportOptions.map((option) => (
                  <button
                    key={option.name}
                    className={`p-2 hover:bg-gray-100 ${
                      option.name === "PDF" ? "text-green-500" : "text-gray-700"
                    }`}
                    onClick={option.action}
                  >
                    Export to {option.name}
                  </button>
                ))}
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      <div className="mt-8 h-full overflow-x-auto">
        <table {...getTableProps()} className="w-full text-sm text-gray-600">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    key={index}
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
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      {...cell.getCellProps()}
                      className="pt-[14px] pb-[20px]"
                      key={`cell-${cellIndex}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentDataTable;
