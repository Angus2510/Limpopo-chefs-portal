'use client';

import React, { useEffect, useMemo } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { FiEdit, FiPlus } from 'react-icons/fi';
import Card from '@/components/card/index';
import { useSelector } from 'react-redux';
import { useGetResultsQuery } from '@/lib/features/assignment/assignmentsResultsApiSlice';
import { useGetIntakeGroupsQuery, selectAllIntakeGroups } from '@/lib/features/intakegroup/intakeGroupApiSlice';
import { useGetCampusesQuery, selectAllCampuses } from '@/lib/features/campus/campusApiSlice';
import { useGetOutcomesQuery, selectAllOutcomes } from '@/lib/features/outcome/outcomeApiSlice';

const MarkAssignmentTable = () => {
  const router = useRouter();

  const { data: resultsNormalized, isLoading, isError } = useGetResultsQuery();
  const { data: intakeGroupsNormalized, isLoading: intakeGroupsLoading, isError: intakeGroupsError } = useGetIntakeGroupsQuery();
  const { data: campusesNormalized, isLoading: campusesLoading, isError: campusesError } = useGetCampusesQuery();
  const { data: outcomesNormalized, isLoading: outcomeLoading, isError: outcomeError } = useGetOutcomesQuery();

  useEffect(() => {
    console.log('Normalized Results:', resultsNormalized);
  }, [resultsNormalized]);

  const results = resultsNormalized ? Object.values(resultsNormalized.entities) : [];
  const intakeGroups = useSelector(selectAllIntakeGroups) ?? [];
  const campuses = useSelector(selectAllCampuses) ?? [];
  const outcomes = useSelector(selectAllOutcomes) ?? [];

  const handleRowClick = (result) => {
    router.push(`/admin/assignment/mark/${result._id}`);
  };

  const handleButtonClick = () => {
    router.push('/admin/mark-assignment/add');
  };

  const intakeGroupOptions = intakeGroups.map(group => ({ label: group.title, value: group.title }));
  const campusOptions = campuses.map(campus => ({ label: campus.title, value: campus.title }));
  const outcomeOptions = outcomes.map(outcome => ({ label: outcome.title, value: outcome.title }));

  const filters = [
    {
      id: 'intakeGroup',
      options: intakeGroupOptions,
      defaultOption: 'All Intakes'
    },
    {
      id: 'campus',
      options: campusOptions,
      defaultOption: 'All Campuses'
    },
    {
      id: 'status',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Writing', value: 'Writing' },
        { label: 'Moderated', value: 'Moderated' },
        { label: 'Marked', value: 'Marked' }
      ],
      defaultOption: 'All Status'
    }
  ];

  const transformedResults = useMemo(() => {
    const transformed = results.map(result => ({
      ...result,
      campus: result.campus?.title || 'N/A',
      intakeGroup: result.intakeGroup?.title || 'N/A',
      studentNumber: result.student?.admissionNumber || 'Unknown',
      studentName: `${result.student?.profile?.firstName || 'Unknown'} ${result.student?.profile?.lastName || ''}`,
      testName: result.assignment?.title || 'Unknown',
      createdBy: `${result.assignment?.lecturer?.profile?.firstName || 'N/A'} ${result.assignment?.lecturer?.profile?.lastName || ''}`,
      dateWritten: result.dateTaken ? new Date(result.dateTaken).toLocaleDateString() : 'N/A'
    }));

    // Sort by most recent date
    transformed.sort((a, b) => new Date(b.dateWritten) - new Date(a.dateWritten));

    // Separate Pending and other statuses
    const pendingResults = transformed.filter(item => item.status === 'Pending');
    const otherResults = transformed.filter(item => item.status !== 'Pending');

    // Combine Pending at the top followed by other statuses
    const orderedResults = [...pendingResults, ...otherResults];

    return orderedResults;
  }, [results]);

  useEffect(() => {
    console.log('Transformed Results:', transformedResults);
  }, [results, intakeGroups, campuses]);

  const columns = [
    { Header: 'Student No', accessor: 'studentNumber' },
    { Header: 'Student Name', accessor: 'studentName' },
    { Header: 'Test Name', accessor: 'testName' },
    { Header: 'Intake Group', accessor: 'intakeGroup' },
    { Header: 'Date Written', accessor: 'dateWritten' },
    { Header: 'Created By', accessor: 'createdBy' },
    { Header: 'Status', accessor: 'status' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click
              window.open(`/admin/assignment/mark/${row.original._id}`, '_blank');
            }}
            className="text-green-500 hover:text-green-700"
          >
            <FiEdit />
          </button>
        </div>
      )
    }
  ];

  // Display loading or error states
  if (isLoading || intakeGroupsLoading || campusesLoading) {
    return <div>Loading...</div>;
  }

  if (isError || intakeGroupsError || campusesError) {
    return <div>Error loading data</div>;
  }

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mark Assignments</h1>
        <button onClick={handleButtonClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          <FiPlus /> Add Assignment
        </button>
      </div>
      <DataTable
        data={transformedResults}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search assignments..."
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default MarkAssignmentTable;
