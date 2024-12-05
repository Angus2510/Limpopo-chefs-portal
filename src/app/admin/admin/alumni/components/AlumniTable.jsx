'use client';

import React from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { FiEye, FiPlus } from 'react-icons/fi'; // Changed FiEdit to FiEye for view icon
import Card from '@/components/card/index';

import { useSelector } from 'react-redux';
import { selectAllAlumni, useGetAlumniQuery } from '@/lib/features/alumni/alumniApiSlice';
import { useGetIntakeGroupsQuery, selectAllIntakeGroups } from '@/lib/features/intakegroup/intakeGroupApiSlice';
import { useGetCampusesQuery, selectAllCampuses } from '@/lib/features/campus/campusApiSlice';

const AlumniTable = () => {
  const router = useRouter();

  const {
    data: alumniNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAlumniQuery();

  const { data: intakeGroupsNormalized, isLoading: intakeGroupsLoading, isError: intakeGroupsError, error: intakeGroupsFetchError, refetch: refetchIntakeGroups } = useGetIntakeGroupsQuery();
  const { data: campusesNormalized, isLoading: campusesLoading, isError: campusesError, error: campusesFetchError, refetch: refetchCampuses } = useGetCampusesQuery();

  const alumni = useSelector(selectAllAlumni);
  const intakeGroups = useSelector(selectAllIntakeGroups);
  const campuses = useSelector(selectAllCampuses);

  const handleRowClick = (alumni) => {
    router.push(`/admin/admin/alumni/${alumni._id}`);
  };

  const handleButtonClick = () => {
    router.push('/admin/admin/alumni/add');
  };

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

  const transformedAlumni = alumni.map(alumni => ({
    ...alumni,
    campus: alumni.campus.map(group => group.title).join(', '),
    intakeGroup: alumni.intakeGroup.map(group => group.title).join(', ')
  }));

  const columns = [
    { Header: 'Student No', accessor: 'admissionNumber' },
    { Header: 'First Name', accessor: 'profile.firstName' },
    { Header: 'Last Name', accessor: 'profile.lastName' },
    { Header: 'ID No', accessor: 'profile.idNumber' },
    { Header: 'Campus', accessor: 'campus' },
    { Header: 'Intake Group', accessor: 'intakeGroup' },
    { Header: 'Result', accessor: 'currentResult' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/admin/alumni/${row.original._id}`);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEye />
          </button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Alumni</h1>
      </div>
      <DataTable
        data={transformedAlumni || []}
        columns={columns}
        filters={filters}
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default AlumniTable;
