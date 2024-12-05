'use client';

import React, { useState } from 'react';
import DataTable from '@/components/tables/BasicTable';
import { useRouter } from 'next/navigation';
import Card from '@/components/card/index';
import { FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectAllWels, useGetWelQuery } from '@/lib/features/wel/welApiSlice';

const WellTable = () => {
  const router = useRouter();

  const {
    data: welNormalized,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWelQuery();

  const wellData = useSelector(selectAllWels);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [accommodationFilter, setAccommodationFilter] = useState('');

  const handleRowClick = (wel) => {
    router.push(`/guardian/well/${wel._id}`);
  };


  const applyFilters = (data) => {
    let filteredData = [...data];

    // Apply location filter
    if (locationFilter !== '') {
      filteredData = filteredData.filter(well => well.location === locationFilter);
    }

    // Apply accommodation filter
    if (accommodationFilter !== '') {
      filteredData = filteredData.filter(well => well.accommodation === accommodationFilter);
    }

    return filteredData;
  };

  const handleLocationChange = (value) => {
    setLocationFilter(value === 'All Locations' ? '' : value);
  };

  const handleAccommodationChange = (value) => {
    setAccommodationFilter(value === 'All Accommodations' ? '' : value);
  };

  const filters = [
    {
      id: 'accommodation',
      value: accommodationFilter,
      onChange: handleAccommodationChange,
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
      defaultOption: 'All Accommodations'
    }
  ];

  const columns = [
    { Header: 'Establishment Name', accessor: 'title' },
    { Header: 'Location', accessor: 'location' },
    { 
      Header: 'Available', 
      accessor: 'available',
      Cell: ({ value }) => (value === true ? 'Yes' : 'No')
    },
    { Header: 'Note', accessor: 'note' },
    { 
      Header: 'Accommodation', 
      accessor: 'accommodation',
      Cell: ({ value }) => (value ? 'Yes' : 'No')
    }
  ];

  return (
    <Card>
      <DataTable
        data={applyFilters(wellData)}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search well data..."
        onRowClick={handleRowClick}
      />
    </Card>
  );
};

export default WellTable;
