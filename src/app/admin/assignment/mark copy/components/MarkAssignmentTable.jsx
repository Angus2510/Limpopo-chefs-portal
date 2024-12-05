'use client';

import React, { useEffect } from 'react';
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
  const { data: outcomesNormalized, isLoading: outcomesLoading, isError: outcomesError } = useGetOutcomesQuery();

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
  const outcomesOptions = outcomes.map(outcomes => ({ label: outcomes.title, value: outcomes.title }));

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
      id: 'outcome',
      options: outcomesOptions,
      defaultOption: 'All Outcomes'
    }
  ];

  const transformedResults = results.map(result => {
    const campusTitle = result.campus?.title || 'N/A';
    const intakeGroupTitle = result.intakeGroup?.title || 'N/A';
    const lecturerName = `${result.assignment?.lecturer?.profile?.firstName || 'N/A'} ${result.assignment?.lecturer?.profile?.lastName || ''}`;
    const outcomeTitle = result.assignment?.outcome?.length > 0 ? result.assignment.outcome.map(outcome => outcome.title).join(', ') : 'N/A';

    return {
      ...result,
      campus: campusTitle,
      intakeGroup: intakeGroupTitle,
      studentNumber: result.student?.admissionNumber || 'Unknown',
      studentName: `${result.student?.profile?.firstName || 'Unknown'} ${result.student?.profile?.lastName || ''}`,
      testName: result.assignment?.title || 'Unknown',
      createdBy: lecturerName,
      outcome: outcomeTitle,
      dateWritten: result.dateTaken ? new Date(result.dateTaken).toLocaleDateString() : 'N/A'
    };
  });

  const sortedTransformedResults = transformedResults.sort((a, b) => new Date(b.dateWritten) - new Date(a.dateWritten));

  useEffect(() => {
    console.log('Transformed Results:', transformedResults);
  }, [results, intakeGroups, campuses]);

  const columns = [
    { Header: 'Student No', accessor: 'studentNumber' },
    { Header: 'Student Name', accessor: 'studentName' },
    { Header: 'Test Name', accessor: 'testName' },
    { Header: 'Intake Group', accessor: 'intakeGroup' },
    { Header: 'Date Written', accessor: 'dateWritten' },
    { Header: 'Outcome', accessor: 'outcome' },  
    { Header: 'Created By', accessor: 'createdBy' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Notes', accessor: 'notes' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
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
      <DataTable
        data={sortedTransformedResults}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search assignments..."
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default MarkAssignmentTable;