'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/tables/BasicTableWithoutFilter'; 
import Card from '@/components/card/index';
import { useGetAllAssignmentResultsQuery } from '@/lib/features/assignment/assignmentMarkApiSlice';

const AllAssignments = () => {
  const router = useRouter();
  const { data: assignmentResults, isLoading, isError } = useGetAllAssignmentResultsQuery();

  useEffect(() => {
    console.log('Raw assignment results:', assignmentResults);
  }, [assignmentResults]);

  const transformedResults = assignmentResults ? assignmentResults.ids.map(id => {
    const result = assignmentResults.entities[id];
    console.log('Processing result:', result);
    return {
      campus: result.campus.title,
      campusId: result.campus._id,
      outcomes: result.outcomes.map(o => ({
        outcomeTitle: o.outcome.title,
        outcomeId: o.outcome._id,
        markedStatus: o.marked
      }))
    };
  }) : [];

  useEffect(() => {
    console.log('Transformed results:', transformedResults);
  }, [transformedResults]);

  const flattenedResults = transformedResults.flatMap(result =>
    result.outcomes.map(outcome => ({
      campus: result.campus,
      campusId: result.campusId,
      outcome: outcome.outcomeTitle,
      outcomeId: outcome.outcomeId,
      markedStatus: outcome.markedStatus
    }))
  );

  useEffect(() => {
    console.log('Flattened results:', flattenedResults);
  }, [flattenedResults]);

  // Sort the flattenedResults by markedStatus to ensure complete entries appear at the bottom
  const sortedResults = flattenedResults.sort((a, b) => {
    const [aMarked, aTotal] = a.markedStatus.split('/').map(Number);
    const [bMarked, bTotal] = b.markedStatus.split('/').map(Number);

    if (aMarked === aTotal && bMarked !== bTotal) {
      return 1;
    } else if (aMarked !== aTotal && bMarked === bTotal) {
      return -1;
    } else {
      return 0;
    }
  });

  const columns = [
    { Header: 'Campus', accessor: 'campus' },
    { Header: 'Outcome', accessor: 'outcome' },
    { Header: 'Marked Status', accessor: 'markedStatus' },
    {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/admin/assignment/mark/group/${row.original.campusId}/${row.original.outcomeId}`)}
              className="text-blue-500 hover:text-blue-700"
            >
              Mark
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

export default AllAssignments;
