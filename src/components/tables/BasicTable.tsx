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
import customStyles from "@/styles/reactSelectStyles";

type Props = {
  columns: any[];
  data: any[];
  filters: { id: string; options: { label: string; value: string }[]; defaultOption: string }[];
  onRowClick?: (row: any) => void;
};

const DataTable = (props: Props) => {
  const { columns, data, filters, onRowClick } = props;

  const [isTableReady, setTableReady] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string[]}>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTableReady(true);
  }, []);

  const handleChange = (id: string, selectedOptions: any) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [id]: selectedOptions.map((option: { value: string }) => option.value)
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
        filtered = filtered.filter((row) => values.includes(row[filter.id]));
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:flex-wrap items-start gap-2 flex-grow ml-4">
          {filters.map((filter) => (
            <div key={filter.id} className="mb-4 flex-grow">
              <Select
                isMulti
                onChange={(selectedOptions) => handleChange(filter.id, selectedOptions)}
                options={filter.options}
                placeholder={filter.defaultOption}
                value={filter.options.filter(option => selectedOptions[filter.id]?.includes(option.value))}
                className="w-full"
                styles={customStyles}
              />
            </div>
          ))}
          <div className="search-bar w-full md:w-auto md:flex-none md:mr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-dmgray-700 rounded-md focus:outline-none dark:bg-dmgray-900 focus:ring-2 focus:ring-green-500"
              style={{ width: '300px', height: '38px' }} 
            />
          </div>
        </div>
        <Dropdown
          button={<FiDownload className="text-xl cursor-pointer" />}
          className={"py-2 top-8 -left-[180px] w-max"}
        >
          <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!dmgray-700 dark:text-white dark:shadow-none">
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

      <div id="dataTable" className="mt-8 h-full overflow-x-auto">
        <table {...getTableProps()} className="w-full text-sm text-gray-600">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-dmgray-700"
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
                  className={onRowClick ? "hover:bg-gray-100 cursor-pointer" : ""}
                  key={`row-${rowIndex}`}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      {...cell.getCellProps()}
                      className="pt-[14px] pb-[20px]"
                      key={`cell-${cellIndex}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100  dark:bg-dmgray-900 rounded-md">
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100  dark:bg-dmgray-900 rounded-md">
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 dark:bg-dmgray-900 rounded-md">
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 dark:bg-dmgray-900 rounded-md">
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
              className="dark:bg-dmgray-900"
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
            className="dark:bg-dmgray-900"
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
