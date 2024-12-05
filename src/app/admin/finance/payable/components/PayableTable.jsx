'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGetStudentFeesQuery, useBulkAddPayableFeesMutation } from '@/lib/features/finance/financeApiSlice';
import { useTable, usePagination } from 'react-table';
import { FiSave } from 'react-icons/fi';
import Card from "@/components/card";
import IntakeGroupSelect from '@/components/select/singleIntakeGroupSelect';
import CampusSelect from '@/components/select/sinlgeCampusSelect';

const StudentFeesTable = () => {
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState('');
  const [editedFees, setEditedFees] = useState([]);

  const { data: studentFees, error, isLoading } = useGetStudentFeesQuery({
    campus: selectedCampus,
    intakeGroup: selectedIntakeGroup,
  });

  const [bulkAddPayableFees] = useBulkAddPayableFeesMutation();

  useEffect(() => {
    if (studentFees) {
      const fees = studentFees.ids.map(id => studentFees.entities[id]);
      if (JSON.stringify(fees) !== JSON.stringify(editedFees)) {
        setEditedFees(fees);
      }
    }
  }, [studentFees]);

  const handleInputChange = (id, field, value, index) => {
    setEditedFees(prevState => prevState.map(student => {
      if (student.id === id) {
        const updatedPayableFees = [...student.payableFees];
        if (index !== undefined) {
          updatedPayableFees[index] = {
            ...updatedPayableFees[index],
            [field]: value
          };
        } else {
          updatedPayableFees.push({
            [field]: value
          });
        }
        return { ...student, payableFees: updatedPayableFees };
      }
      return student;
    }));
  };

  const handleSave = async () => {
    try {
      await bulkAddPayableFees(editedFees).unwrap();
      alert('Fees saved successfully');
    } catch (err) {
      alert('Failed to save Fees');
      console.error('Failed to save fees: ', err);
    }
  };

  const columns = useMemo(() => [
    {
      Header: 'Student Number',
      accessor: 'studentNumber',
    },
    {
      Header: 'Student Name',
      accessor: 'studentName',
    },
    {
      Header: 'Admission Date',
      accessor: 'admissionDate',
    },
    {
      Header: 'City And Guild Number',
      accessor: 'cityAndGuildNumber',
    },
    {
      Header: 'Amount',
      Cell: ({ row }) => (
        <input
          type="number"
          value={
            row.original.payableFees.length > 0
              ? row.original.payableFees[0].amount
              : ''
          }
          onChange={(e) =>
            handleInputChange(row.original.id, 'amount', e.target.value, 0)
          }
        />
      ),
    },
    {
      Header: 'Block Profile',
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={
            row.original.payableFees.length > 0
              ? row.original.payableFees[0].arrears
              : false
          }
          onChange={(e) =>
            handleInputChange(row.original.id, 'arrears', e.target.checked, 0)
          }
        />
      ),
    },
    {
      Header: 'Due Date',
      Cell: ({ row }) => (
        <input
          type="date"
          value={
            row.original.payableFees.length > 0 && row.original.payableFees[0].dueDate
              ? row.original.payableFees[0].dueDate.split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleInputChange(row.original.id, 'dueDate', e.target.value, 0)
          }
        />
      ),
    },
  ], []);

  const data = useMemo(() => editedFees, [editedFees]);

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
  } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, usePagination);

  return (
    <div>
      <Card className={"w-full pb-10 p-4 h-full"}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start gap-2 flex-grow ml-4">
            <div className="mb-4 flex-grow">
              <CampusSelect
                selectedCampus={selectedCampus}
                setSelectedCampus={setSelectedCampus}
              />
            </div>
            <div className="mb-4 flex-grow">
              <IntakeGroupSelect
                selectedIntakeGroup={selectedIntakeGroup}
                setSelectedIntakeGroup={setSelectedIntakeGroup}
              />
            </div>
          </div>
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p>No students found</p>}
        {studentFees && (
          <div className="mt-8 h-full overflow-x-auto">
            <table {...getTableProps()} className="w-full text-sm text-gray-600">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} key={column.id} className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                        <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                          {column.render('Header')}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} key={cell.column.id} className="pt-[14px] pb-[20px]">{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination">
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
      </Card>
      <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-5">
        <FiSave /> Save</button>
    </div>
  );
};

export default StudentFeesTable;
