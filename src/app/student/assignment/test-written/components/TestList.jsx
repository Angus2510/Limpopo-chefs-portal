'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTableWithoutFilter';
import { useRouter } from 'next/navigation';
import { useGetStudentAssignmentResultsQuery } from '@/lib/features/assignment/studentAssignmentsApiSlice';

const AssignmentResultsTable = ({ studentId }) => {
  const {
    data: assignmentResultsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudentAssignmentResultsQuery(studentId);

  const columns = [
    { Header: 'Assignment Name', accessor: 'assignment.title' },
    { Header: 'Date Written', accessor: 'dateTaken', Cell: ({ value }) => new Date(value).toLocaleString() },
    { Header: 'Created By', accessor: 'assignment.lecturer.profile.firstName', Cell: ({ row }) => `${row.original.assignment.lecturer.profile.firstName} ${row.original.assignment.lecturer.profile.lastName}` },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Notes', accessor: 'feedback', Cell: ({ value }) => value.join(', ') },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message}</p>;

  const data = assignmentResultsNormalized?.ids.map(id => assignmentResultsNormalized.entities[id]) || [];
  const sortedData = data.sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));

  return (
    <DataTable
      data={sortedData}
      columns={columns}
      searchPlaceholder="Search assignment results..."
    />
  );
};

export default AssignmentResultsTable;
