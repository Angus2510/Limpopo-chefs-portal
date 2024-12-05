'use client'

import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';

import { useSelector } from 'react-redux';
import { selectAllStudents } from '@/lib/features/students/studentsApiSlice';
import { useGetStudentsQuery } from '@/lib/features/students/studentsApiSlice';

import { useGetIntakeGroupsQuery, selectAllIntakeGroups } from '@/lib/features/intakegroup/intakeGroupApiSlice';
import { useGetCampusesQuery, selectAllCampuses } from '@/lib/features/campus/campusApiSlice';


const CollectTable = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [intakeGroupFilter, setIntakeGroupFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');

  const {
    data: studentsNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudentsQuery();

  const students = useSelector(selectAllStudents);

  const { data: intakeGroupsNormalized, isLoading: intakeGroupsLoading, isError: intakeGroupsError, error: intakeGroupsFetchError, refetch: refetchIntakeGroups } = useGetIntakeGroupsQuery();
  const { data: campusesNormalized, isLoading: campusesLoading, isError: campusesError, error: campusesFetchError, refetch: refetchCampuses } = useGetCampusesQuery();

  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  
  const intakeGroupOptions = intakeGroups.map(group => ({ label: group.title, value: group.title }));
  const campusOptions = campuses.map(campus => ({ label: campus.title, value: campus.title }));

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
  ];

  const transformedStudents = students.map(student => ({
    ...student,
    campus: student.campus.map(group => group.title).join(', '),
    intakeGroup: student.intakeGroup.map(group => group.title).join(', ')
  }));

  const columns = [
    { Header: 'Intake Group', accessor: 'intakeGroup' },
    { Header: 'Campus', accessor: 'campus' },
    { Header: 'Student Number', accessor: 'admissionNumber' },
    { Header: 'Student Name', accessor: 'profile.firstName'},
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => ( 
        <button
          className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          onClick={(event) => {
            event.stopPropagation(); 
            router.push(`/admin/finance/collect/${row.original._id}`);
          }}
        >
          Collect Fees
        </button>
      )
    }
  ];


  return (
    <DataTable
      data={transformedStudents || []}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search students..."
    />
  );
};

export default CollectTable;
