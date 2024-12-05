import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter, useFilters, Column } from 'react-table';
import Card from "@/components/card";
import Dropdown from "@/components/dropdown";
import { FiSearch, FiDownload } from "react-icons/fi";
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/exportUtils';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: string;
  value?: string;
  defaultOption: string;
  options: FilterOption[];
  onChange: (value: string | undefined) => void;
}

interface DataTableProps {
  data: any[];
  columns: Column<any>[];
  fetchData?: () => void;
  onRowClick?: (row: any) => void;
  loading: boolean;
  error?: { message: string };
  filters?: Filter[];
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  fetchData,
  onRowClick,
  loading,
  error,
  filters = [],
  searchPlaceholder = "Search records...",
  actions = null
}) => {
  const filterTypes = useMemo(() => ({
    text: (rows: any[], columnIds: string[], filterValue: any) => {
      return rows.filter(row => {
        for (const columnId of columnIds) {
          const rowValue = row.values[columnId];
          if (rowValue !== undefined && String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    },
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    setFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, globalFilter }
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleRefresh = () => {
    if (fetchData) fetchData();
  };

  const exportOptions = [
    { name: "Excel", action: () => exportToExcel(getCSVColumns(columns), data) },
  ];

  if (loading) return <Card>Loading...</Card>;
  if (error) return <Card>Error: {error.message || 'Unknown error'}</Card>;

  return (
    <Card className={"w-full pb-10 p-4 h-full"}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value || ''}
              onChange={e => {
                const newFilterValue = e.target.value || undefined;
                filter.onChange(newFilterValue);
                setFilter(filter.id, newFilterValue);
              }}
              className="p-1 border rounded text-sm"
            >
              <option value="">{filter.defaultOption}</option>
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ))}
        </div>
        {actions}
        <Dropdown
          button={<FiDownload className="text-xl cursor-pointer" />}
          className={"py-2 top-8 -left-[180px] w-max"}
        >
          <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="flex flex-col p-4">
              {exportOptions.map((option, index) => (
                <button key={index} className={`p-2 hover:bg-gray-100 ${option.name === 'PDF' ? 'text-green-500' : 'text-gray-700'}`} onClick={option.action}>
                  Export to {option.name}
                </button>
              ))}
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="mt-8 h-full overflow-x-auto">
        <table {...getTableProps()} className="w-full text-sm text-gray-600" id="dataTable">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700" key={column.id}>
                    {String(column.render('Header'))} {/* Ensure Header is a string */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => onRowClick && onRowClick(row.original)} className="hover:bg-gray-100" key={`row-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} className="pt-[14px] pb-[20px]" key={`cell-${cellIndex}`}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination py-3 flex items-center justify-between">
          <div>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
              Previous
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="px-4 py-2 text-sm bg-gray-100 rounded-md">
              Next
            </button>
          </div>
          <div>
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface DefaultColumnFilterProps {
  column: {
    filterValue: string | undefined;
    setFilter: (value: string | undefined) => void;
    preFilteredRows: any[];
    id: string;
  };
}

function DefaultColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: DefaultColumnFilterProps) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => setFilter(e.target.value || undefined)}
      placeholder={`Search ${count} records...`}
    />
  );
}

const getCSVColumns = (columns: Column<any>[]) => {
  return columns
    .filter(col => typeof col.accessor === 'string' && col.accessor !== undefined)
    .map(col => ({
      Header: String(col.Header || ''), 
      accessor: col.accessor as string
    }));
};

export default DataTable;
