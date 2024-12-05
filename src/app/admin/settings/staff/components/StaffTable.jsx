"use client";
import React from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { FiEdit, FiEye, FiPlus } from 'react-icons/fi';
import Card from '@/components/card/index';
import { useGetStaffQuery } from '@/lib/features/staff/staffApiSlice';

const StaffTable = () => {
  const router = useRouter();
  const { data: staffData, isLoading, isError } = useGetStaffQuery();

  const handleAddStaffClick = () => {
    router.push('/admin/settings/staff/add');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading staff data.</p>;
  }

  console.log('Staff data:', staffData); // Log the staff data for debugging

  // Extract values from entities to get an array of staff members
  const staff = staffData ? Object.values(staffData.entities) : [];

  const filters = [
    {
      id: 'roles',
      options: [
        { label: 'Administration', value: 'Administration' },
        { label: 'Lecturer', value: 'Lecturer' }
      ],
      defaultOption: 'All Intakes'
    },
  ];

  const transformedStaff = staff.map(staff => ({
    ...staff,
    roles: staff.roles ? staff.roles.map(group => group.roleName).join(', ') : 'No roles',
  }));

  const columns = [
    { Header: 'Staff ID', accessor: 'username' },
    { Header: 'Name', accessor: row => `${row.profile.firstName} ${row.profile.lastName}` },
    { Header: 'Designation', accessor: row => row.profile.designation},
    { Header: 'Email', accessor: 'email' },
    { Header: 'MobileNumber', accessor: row => row.profile.mobileNumber},
    { Header: 'Roles', accessor: 'roles' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/settings/staff/edit/${row.original.id}`);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation(); 
              router.push(`/admin/settings/staff/${row.original.id}`);
            }}
            className="text-green-500 hover:text-green-700"
          >
            <FiEye />
          </button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <div className="mt-4 mb-4 flex justify-end items-center">
        <button onClick={handleAddStaffClick} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4">
          <FiPlus /> Add Staff
        </button>
      </div>
      <DataTable
        data={transformedStaff || []}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search staff..."
        onRowClick={staffMember => router.push(`/admin/settings/staff/${staffMember.id}`)}
      />
    </Card> 
  );
};

export default StaffTable;