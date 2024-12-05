"use client"
import React, { useState, useMemo } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { FiEdit, FiCopy, FiEye, FiDownload} from 'react-icons/fi';

import { useSelector } from 'react-redux';
import { selectAllAssignments} from '@/lib/features/assignment/assignmentsApiSlice';

import { useGetAssignmentsQuery } from '@/lib/features/assignment/assignmentsApiSlice';
import DownloadButton from './DownloadButton';

import { useGetIntakeGroupsQuery, selectAllIntakeGroups } from '@/lib/features/intakegroup/intakeGroupApiSlice';
import { useGetCampusesQuery, selectAllCampuses } from '@/lib/features/campus/campusApiSlice';
import { useGetOutcomesQuery, selectAllOutcomes } from '@/lib/features/outcome/outcomeApiSlice';


const TestsTable = () => {
  const router = useRouter();

  const { data: intakeGroupsNormalized, isLoading: intakeGroupsLoading, isError: intakeGroupsError } = useGetIntakeGroupsQuery();
  const { data: campusesNormalized, isLoading: campusesLoading, isError: campusesError } = useGetCampusesQuery();
  const { data: outcomesNormalized, isLoading: outcomesLoading, isError: outcomesError } = useGetOutcomesQuery();

  const {
    data: assignmentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAssignmentsQuery();

  const tests = useSelector(selectAllAssignments);

  const intakeGroups = useSelector(selectAllIntakeGroups) ?? [];
  const campuses = useSelector(selectAllCampuses) ?? [];
  const outcomes = useSelector(selectAllOutcomes) ?? [];
  

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
      id: 'overallOutcome',
      options: outcomesOptions,
      defaultOption: 'All Outcomes'
    },
    {
      id: 'type',
      options: [
        { label: 'Test', value: 'Test' },
        { label: 'Task', value: 'Task' }
      ],
      defaultOption: 'All Types'
    }
  ];

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const transformedAndSortedTests = useMemo(() => {
    const transformed = tests.map(test => ({
      ...test,
      campus: Array.isArray(test.campus) ? test.campus.map(c => c.title).join(', ') : 'N/A',
      intakeGroup: Array.isArray(test.intakeGroups) ? test.intakeGroups.map(group => group.title).join(', ') : 'N/A',
      createdBy: `${test.lecturer?.profile?.firstName || 'N/A'} ${test.lecturer?.profile?.lastName || ''}`,
      overallOutcome: Array.isArray(test.outcome) ? test.outcome.map(outcome => outcome.title).join(', ') : 'N/A',
      testDate: test.availableFrom ? formatDateTime(test.availableFrom) : 'N/A',
      dateCreated: test.createdAt ? formatDate(test.createdAt) : 'N/A',
    }));

    return transformed.sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
  }, [tests]);

  const columns = [
    { Header: 'Test Name', accessor: 'title' },
    { Header: 'Date Created', accessor: 'dateCreated' },
    { Header: 'Test Date', accessor: 'testDate' },
    { Header: 'Created By', accessor: 'createdBy' },
    { Header: 'Campus', accessor: 'campus'},
    { Header: 'Intake Group', accessor: 'intakeGroup'},
    { Header: 'Overall Outcome', accessor: 'overallOutcome'},
    { Header: 'Exam Type', accessor: 'type' },
    { Header: 'Password', accessor: 'password' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/assignment/edit/${row.original._id}`);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation(); 
              router.push(`/admin/assignment/duplicate/${row.original._id}`);
            }}
            className="text-brand-500 hover:text-brand-700"
          >
            <FiCopy />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/assignment/${row.original._id}`);
            }}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <FiEye />
          </button>
          <DownloadButton assignmentId={row.original._id} />
        </div>
      )
    }
  ];

  return (


    <DataTable
      data={transformedAndSortedTests || []}
      columns={columns}
      filters={filters}
    />
  );
};

export default TestsTable;