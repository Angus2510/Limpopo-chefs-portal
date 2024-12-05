'use client';
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Select from "react-select";
import Card from "@/components/card";
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/exportUtils';
import Dropdown from "@/components/dropdown";
import { FiDownload } from "react-icons/fi";

type RowData = {
  id: string;
  [key: string]: any;
};

type Filter = {
  id: string;
  options: { label: string; value: string }[];
  defaultOption: string;
};

type Props = {
  columns: any[];
  data: RowData[];
  filters: Filter[];
  onRowClick?: (row: any) => void;
  onGraduateStudents?: (selectedIds: string[], passFailStatus: { id: string; value: string }[]) => void;
  isGenerating?: boolean;
  onPassFailChange?: (id: string, value: string) => void;
};

const DataTable: React.FC<Props> = ({ columns, data, filters, onRowClick, onGraduateStudents, isGenerating, onPassFailChange }) => {
  const [isTableReady, setTableReady] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [passFailStatus, setPassFailStatus] = useState<{ id: string; value: string }[]>([]);

  useEffect(() => {
    setTableReady(true);
  }, []);

  const handleChange = (id: string, selectedOptions: any) => {
    setSelectedOptions(prevSelectedOptions => ({
      ...prevSelectedOptions,
      [id]: selectedOptions.map((option: { value: string }) => option.value),
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectAllChange = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)));
    }
  };

  const handleRowCheckboxChange = (id: string) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
  };

  const handlePassFailChange = (id: string, value: string) => {
    setPassFailStatus(prevStatus => {
      const newStatus = prevStatus.filter(status => status.id !== id);
      newStatus.push({ id, value });
      return newStatus;
    });
    onPassFailChange && onPassFailChange(id, value);
  };

  const exportOptions = [
    { name: "Excel", action: () => exportToExcel(columns.filter(col => col.accessor !== 'actions'), filteredData) },
    { name: "PDF", action: () => exportToPDF(columns.filter(col => col.accessor !== 'actions'), filteredData) }
  ];

  const filteredData = useMemo(() => {
    let filtered = [...data];

    for (const filter of filters) {
      const values = selectedOptions[filter.id] || [];
      if (values.length > 0 && !values.includes(filter.defaultOption)) {
        filtered = filtered.filter(row => values.includes(row[filter.id]));
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(row => {
        return Object.values(row).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [data, filters, selectedOptions, searchQuery]);

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

  if (!isTableReady) return null;

  return (
    <Card className={"w-full pb-10 p-4 h-full"}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {filters.map(filter => (
            <div key={filter.id} className="mb-4">
              <Select
                isMulti
                onChange={selectedOptions => handleChange(filter.id, selectedOptions)}
                options={filter.options}
                placeholder={filter.defaultOption}
                value={filter.options.filter(option => selectedOptions[filter.id]?.includes(option.value))}
              />
            </div>
          ))}
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
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative"
            onClick={() => onGraduateStudents && onGraduateStudents(Array.from(selectedRows), passFailStatus)}
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
          <Dropdown
            button={<FiDownload className="text-xl cursor-pointer" />}
            className={"py-2 top-8 -left-[180px] w-max"}
          >
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="flex flex-col p-4">
                {exportOptions.map(option => (
                  <button key={option.name} className={`p-2 hover:bg-gray-100 ${option.name === 'PDF' ? 'text-green-500' : 'text-gray-700'}`} onClick={option.action}>
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
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredData.length}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Pass/Fail
                  </div>
                </th>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={`row-${rowIndex}`}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.original.id)}
                      onChange={() => handleRowCheckboxChange(row.original.id)}
                    />
                  </td>
                  <td>
                    <select
                      value={row.original.currentResult}
                      onChange={(e) => handlePassFailChange(row.original.id, e.target.value)}
                    >
                      <option value="Fail">Fail</option>
                      <option value="Pass">Pass</option>
                    </select>
                  </td>
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
        {/* Pagination */}
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};

export default DataTable;