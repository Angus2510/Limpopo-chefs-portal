"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Select from "react-select";
import Card from "@/components/card";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";
import Dropdown from "@/components/dropdown";
import { FiDownload } from "react-icons/fi";

// RowData defines the structure for a row in the table
type RowData = {
  id: string;
  [key: string]: any; // Flexible property, allowing any other data per row
};

// Filter type defines how each filter will look
type Filter = {
  id: string;
  options: { label: string; value: string }[]; // List of options for each filter
  defaultOption: string; // The default filter value
};

// Props that the DataTable component accepts
type Props = {
  columns: any[]; // Columns of the table
  data: RowData[]; // Data to be displayed in the table
  filters: Filter[]; // Filters to apply to the data
  onRowClick?: (row: any) => void; // Optional callback when a row is clicked
  onGraduateStudents?: (
    selectedIds: string[],
    passFailStatus: { id: string; value: string }[]
  ) => void; // Optional callback to handle graduating students
  isGenerating?: boolean; // Indicates if a generation process is ongoing
  onPassFailChange?: (id: string, value: string) => void; // Optional callback when pass/fail status is changed
};

// DataTable component that displays a table with features like filtering, sorting, pagination, and exporting
const DataTable: React.FC<Props> = ({
  columns,
  data,
  filters,
  onRowClick,
  onGraduateStudents,
  isGenerating,
  onPassFailChange,
}) => {
  // State hooks for various table features
  const [isTableReady, setTableReady] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({});
  const [searchQuery, setSearchQuery] = useState(""); // For search query input
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set()); // Tracks selected rows
  const [passFailStatus, setPassFailStatus] = useState<
    { id: string; value: string }[]
  >([]); // Tracks pass/fail status

  // Set table ready state after component mount
  useEffect(() => {
    setTableReady(true);
  }, []);

  // Handler for changing the filter options
  const handleChange = (id: string, selectedOptions: any) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [id]: selectedOptions.map((option: { value: string }) => option.value),
    }));
  };

  // Handler for search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Select/Deselect all rows in the table
  const handleSelectAllChange = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((row) => row.id)));
    }
  };

  // Handler for individual row checkbox change
  const handleRowCheckboxChange = (id: string) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
  };

  // Handler for pass/fail status change
  const handlePassFailChange = (id: string, value: string) => {
    setPassFailStatus((prevStatus) => {
      const newStatus = prevStatus.filter((status) => status.id !== id);
      newStatus.push({ id, value });
      return newStatus;
    });
    onPassFailChange && onPassFailChange(id, value); // Call external handler if provided
  };

  // Export options for different formats (Excel, PDF)
  const exportOptions = [
    {
      name: "Excel",
      action: () =>
        exportToExcel(
          columns.filter((col) => col.accessor !== "actions"),
          filteredData
        ),
    },
    {
      name: "PDF",
      action: () =>
        exportToPDF(
          columns.filter((col) => col.accessor !== "actions"),
          filteredData
        ),
    },
  ];

  // Filter the data based on selected filters and search query
  const filteredData = useMemo(() => {
    let filtered = [...data]; // Start with all data

    // Apply filters
    for (const filter of filters) {
      const values = selectedOptions[filter.id] || [];
      if (values.length > 0 && !values.includes(filter.defaultOption)) {
        filtered = filtered.filter((row) => values.includes(row[filter.id]));
      }
    }

    // Apply search query if present
    if (searchQuery) {
      filtered = filtered.filter((row) => {
        return Object.values(row).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [data, filters, selectedOptions, searchQuery]);

  // React Table hooks
  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Destructure table instance for pagination and other table properties
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { globalFilter, pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    setPageSize,
  } = tableInstance;

  // If the table is not ready, return null to avoid rendering
  if (!isTableReady) return null;

  return (
    <Card className={"w-full pb-10 p-4 h-full"}>
      {/* Table Header and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Render filter dropdowns */}
          {filters.map((filter) => (
            <div key={filter.id} className="mb-4">
              <Select
                isMulti
                onChange={(selectedOptions) =>
                  handleChange(filter.id, selectedOptions)
                }
                options={filter.options}
                placeholder={filter.defaultOption}
                value={filter.options.filter((option) =>
                  selectedOptions[filter.id]?.includes(option.value)
                )}
              />
            </div>
          ))}
          {/* Search input */}
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {/* Graduate Students button */}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative"
            onClick={() =>
              onGraduateStudents &&
              onGraduateStudents(Array.from(selectedRows), passFailStatus)
            }
            disabled={isGenerating}
          >
            {isGenerating ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.5A10.5 10.5 0 002.5 12H4z"
                ></path>
              </svg>
            ) : (
              "Graduate Students"
            )}
          </button>
          {/* Export Dropdown */}
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

      {/* Table */}
      <table {...getTableProps()} className="table-auto w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-b px-4 py-2 text-left"
                  key={column.id}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="border-b px-4 py-2"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination mt-4">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default DataTable;
