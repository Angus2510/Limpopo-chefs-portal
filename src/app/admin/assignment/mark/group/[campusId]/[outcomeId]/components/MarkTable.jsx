'use client';

import React, { useEffect } from 'react';
import { useGetAssignmentResultsByCampusAndOutcomeQuery } from '@/lib/features/assignment/assignmentMarkApiSlice';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import Card from '@/components/card/index';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MarkTable = ({ campus, outcome }) => {
  const router = useRouter();
  const { data: assignmentResults, isLoading, isError } = useGetAssignmentResultsByCampusAndOutcomeQuery({ campusId: campus, outcomeId: outcome });

  useEffect(() => {
    console.log('Raw assignment results:', assignmentResults);
  }, [assignmentResults]);

  console.log(assignmentResults)

  const transformedResults = assignmentResults ? assignmentResults.ids.map(id => {
    const result = assignmentResults.entities[id];
    console.log('Processing result:', result);
    return { 
      studentNumber: result.student.admissionNumber,
      lecturer:`${result.lecturer.profile.firstName} ${result.lecturer.profile.lastName}`,
      assignmentTitle: result.assignmentTitle,
      assignmentId: result.assignmentId,
      markedStatus: result.status,
      scores: result.scores,
      student: `${result.student.profile.firstName} ${result.student.profile.lastName}`,
    };
  }) : [];

  const statusOrder = ['Pending' , 'Writing' , 'Starting' , 'Terminated', 'Marked', 'Moderated'];

  const sortedResults = transformedResults.sort((a, b) => {
    return statusOrder.indexOf(a.markedStatus) - statusOrder.indexOf(b.markedStatus);
  });

  useEffect(() => {
    console.log('Transformed results:', transformedResults);
  }, [transformedResults]);

  const columns = [
    { Header: 'Student No', accessor: 'studentNumber' },
    { Header: 'Student', accessor: 'student' },
    { Header: 'Test Name', accessor: 'assignmentTitle' },
    { Header: 'Created By', accessor: 'lecturer'},
    { Header: 'Marked Status', accessor: 'markedStatus' },
    { Header: 'Notes', accessor: 'notes' },
    {
        Header: 'Actions',
        accessor: 'assignmentId',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                window.open(`/admin/assignment/mark/assignment/${row.original.assignmentId}`, '_blank')
              }}
              className="text-green-500 hover:text-green-700"
            >
              <FiEdit />
            </button>
          </div>
        )
      }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <Card>
      <DataTable
        data={sortedResults}
        columns={columns}
        searchPlaceholder="Search assignments..."
      />
    </Card>
  );
};

export default MarkTable;
