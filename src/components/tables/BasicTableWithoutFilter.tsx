import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Select from "react-select";
import Card from "@/components/card";

type Props = {
  columns: any[];
  data: any[];
  onRowClick?: (row: any) => void;
  getCurrentPage?: (currentPage: number) => void; // New prop for getting current page
};

const DataTable = ({ columns, data, onRowClick, getCurrentPage }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [data, searchQuery]);

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
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    setPageSize,
  } = tableInstance;

  useEffect(() => {
    getCurrentPage && getCurrentPage(pageIndex);
  }, [pageIndex, getCurrentPage]);

  return (
    <Card className={"w-full pb-10 p-4 h-full"}>

      <div className="flex justify-between items-center mb-4">
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

      <div className="mt-8 h-full overflow-x-auto">
        <table {...getTableProps()} className="w-full text-sm text-gray-600">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className="hover:bg-gray-100"
                  key={`row-${rowIndex}`}
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
