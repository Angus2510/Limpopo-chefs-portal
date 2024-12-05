'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';

import { useSelector } from 'react-redux';
import { useGetModerationReportQuery } from '@/lib/features/reports/reportsApiSlice';

const ModerationTable = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [intakeGroupFilter, setIntakeGroupFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');

  const { data: moderationData, isLoading, isError, error, refetch } = useGetModerationReportQuery();

  const filters = [
    {
      id: 'intakeGroup',
      options: [
        { label: 'IntakeX', value: 'IntakeX' },
        { label: 'IntakeY', value: 'IntakeY' }
      ],
      defaultOption: 'All Intakes'
    },
    {
      id: 'campus',
      options: [
        { label: 'CampusA', value: 'CampusA' },
        { label: 'CampusB', value: 'CampusB' }
      ],
      defaultOption: 'All Campuses'
    }
  ];

  useEffect(() => {
    if (moderationData) {
      console.log('Moderation Data:', moderationData);
    }
  }, [moderationData]);

  const transformedModerationData = moderationData?.ids.map(id => {
    const report = moderationData.entities[id];
    return {
      id: report.id || report._id, // Use a different property as the ID if `id` is not available
      studentNo: report.studentNumber,
      studentName: report.studentName,
      testName: report.testName,
      intakeGroup: report.intakeGroup,
      dateWritten: report.dateWritten,
      campus: report.campus
    };
  }) || [];

  const columns = [
    { Header: 'Student No', accessor: 'studentNo' },
    { Header: 'Student Name', accessor: 'studentName' },
    { Header: 'Test Name', accessor: 'testName' },
    { Header: 'Intake Group', accessor: 'intakeGroup' },
    { Header: 'Date Written', accessor: 'dateWritten' },
    { Header: 'Campus', accessor: 'campus' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/admin/assignment/view/${row.original.id}`);
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
    <DataTable
      data={transformedModerationData}
      columns={columns}
      filters={filters}
    />
  );
};

export default ModerationTable;
