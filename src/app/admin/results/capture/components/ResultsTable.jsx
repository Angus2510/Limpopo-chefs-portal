'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGetResultsQuery, useUpdateResultsMutation } from '@/lib/features/results/resultsApiSlice';
import { useTable, usePagination } from 'react-table';
import { FiSave } from 'react-icons/fi';
import Card from "@/components/card";
import IntakeGroupSelect from '@/components/select/singleIntakeGroupSelect';
import CampusSelect from '@/components/select/sinlgeCampusSelect';
import OutcomeSelect from '@/components/select/singleOutcomeSelect';

const ResultsTable = () => {
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [editedResults, setEditedResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { data: resultsData, error, isLoading } = useGetResultsQuery({
    campus: selectedCampus,
    intakeGroup: selectedIntakeGroup,
    outcome: selectedOutcome,
  }, { skip: !selectedCampus || !selectedIntakeGroup || !selectedOutcome });
  
  const [updateResults] = useUpdateResultsMutation();

  console.log(resultsData)
  
  useEffect(() => {
    if (resultsData) {
      const results = resultsData.ids.map(id => resultsData.entities[id]);
      if (JSON.stringify(results) !== JSON.stringify(editedResults)) {
        setEditedResults(results);
      }
    }
  }, [resultsData]);

  const handleInputChange = (id, field, value) => {
    setEditedResults(prevState => prevState.map(student => {
      if (student.id === id) {
        const updatedResults = [...student.results];
        if (updatedResults.length === 0) {
          updatedResults.push({});
        }
        updatedResults[0] = {
          ...updatedResults[0],
          [field]: value
        };
        return { ...student, results: updatedResults };
      }
      return student;
    }));
  };

  const handleCheckboxChange = (id, checked) => {
    setEditedResults(prevState => prevState.map(student => {
      if (student.id === id) {
        const updatedResults = [...student.results];
        if (updatedResults.length === 0) {
          updatedResults.push({});
        }
        updatedResults[0] = {
          ...updatedResults[0],
          overallOutcome: checked ? 'Competent' : 'Not Yet Competent'
        };
        return { ...student, results: updatedResults };
      }
      return student;
    }));
  };

  const handleSave = async () => {
    const payload = {
      outcomeType: resultsData.outcomeType,
      campus: selectedCampus,
      intakeGroup: selectedIntakeGroup,
      outcome: selectedOutcome,
      results: editedResults.map((student) => ({
        studentNumber: student.studentNumber,
        studentName: student.studentName,
        results: student.results,
      })),
    };

    try {
      await updateResults(payload).unwrap();
      alert('Results updated successfully');
    } catch (err) {
      console.error('Failed to update results: ', err);
    }
  };

  const computeAverage = (testScore, taskScore) => {
    if (testScore !== undefined && taskScore !== undefined) {
      return Math.round((parseFloat(testScore) + parseFloat(taskScore)) / 2);
    }
    return '';
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: 'Student Name',
        accessor: 'studentName',
      },
      {
        Header: 'Student Number',
        accessor: 'studentNumber',
      },
    ];

    if (resultsData && resultsData.outcomeType !== 'Theory') {
      baseColumns.push({
        Header: 'Mark',
        Cell: ({ row }) => (
          <input
            type="number"
            value={
              row.original.results && row.original.results.length > 0
                ? row.original.results[0].score || ''
                : ''
            }
            onChange={(e) =>
              handleInputChange(row.original.id, 'score', e.target.value)
            }
          />
        ),
      });
    }

    if (resultsData && resultsData.outcomeType === 'Theory') {
      baseColumns.push({
        Header: 'Test Mark',
        Cell: ({ row }) => (
          <input
            type="number"
            value={
              row.original.results && row.original.results.length > 0
                ? row.original.results[0].testScore || ''
                : ''
            }
            onChange={(e) =>
              handleInputChange(row.original.id, 'testScore', e.target.value)
            }
          />
        ),
      });

      baseColumns.push({
        Header: 'Task Mark',
        Cell: ({ row }) => (
          <input
            type="number"
            value={
              row.original.results.length > 0
                ? row.original.results[0].taskScore || ''
                : ''
            }
            onChange={(e) =>
              handleInputChange(row.original.id, 'taskScore', e.target.value)
            }
          />
        ),
      });

      baseColumns.push({
        Header: 'Overall Mark',
        Cell: ({ row }) => {
          const testScore = row.original.results.length > 0 ? row.original.results[0].testScore : undefined;
          const taskScore = row.original.results.length > 0 ? row.original.results[0].taskScore : undefined;
          const averageScore = computeAverage(testScore, taskScore);

          return (
            <input
              type="number"
              value={averageScore}
              readOnly
            />
          );
        },
      });
    }

    baseColumns.push({
      Header: 'Competent',
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={
            row.original.results && row.original.results.length > 0
              ? row.original.results[0].overallOutcome === 'Competent'
              : false
          }
          onChange={(e) =>
            handleCheckboxChange(row.original.id, e.target.checked)
          }
        />
      ),
    });

    return baseColumns;
  }, [resultsData]);

  const data = useMemo(() => editedResults, [editedResults]);

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
  } = useTable({ columns, data, initialState: { pageIndex: currentPage, pageSize: 10 } }, usePagination);

  useEffect(() => {
    gotoPage(currentPage);
  }, [currentPage, gotoPage]);

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
          <div className="mb-4 flex-grow">
            <OutcomeSelect
              selectedOutcome={selectedOutcome}
              setSelectedOutcome={setSelectedOutcome}
            />
          </div>
        </div>
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data</p>}
        {resultsData && (
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
          <button onClick={() => {setCurrentPage(0); gotoPage(0)}} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'<<'}
          </button>{' '}
          <button onClick={() => {setCurrentPage(pageIndex - 1); previousPage()}} disabled={!canPreviousPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'<'}
          </button>{' '}
          <button onClick={() => {setCurrentPage(pageIndex + 1); nextPage()}} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
            {'>'}
          </button>{' '}
          <button onClick={() => {setCurrentPage(pageCount - 1); gotoPage(pageCount - 1)}} disabled={!canNextPage} className="mr-2 px-4 py-2 text-sm bg-gray-100 rounded-md">
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
                setCurrentPage(page);
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

export default ResultsTable;
