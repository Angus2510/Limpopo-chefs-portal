"use client";

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetAvailableAccommodationsQuery } from '@/lib/features/accommodation/accommodationApiSlice';

function AccommodationSelect({ selectedAccommodation, setSelectedAccommodation }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: accommodationsData, isLoading, isError, error } = useGetAvailableAccommodationsQuery();

  const accommodations = accommodationsData ? Object.values(accommodationsData.entities) : [];

  const handleAccommodationSelection = (accommodationId) => {
    setSelectedAccommodation(accommodationId);
    setIsOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  const selectedAccommodationDetails = accommodations.find(accommodation => accommodation.id === selectedAccommodation);
  const selectedAccommodationTitle = selectedAccommodationDetails
    ? `${selectedAccommodationDetails.roomNumber}, ${selectedAccommodationDetails.address}, ${selectedAccommodationDetails.roomType} ${selectedAccommodationDetails.occupantType}`
    : 'Select an accommodation';

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Accommodation *</label>
      <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
        <span className="text-gray-700">{selectedAccommodationTitle}</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto focus:outline-none"
        >
          {isOpen ? <FiChevronUp className="inline-block text-gray-700" /> : <FiChevronDown className="inline-block text-gray-700" />}
        </button>
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-gray-300 rounded-md bg-white shadow-lg">
          {accommodations.map(accommodation => (
            <li key={accommodation.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAccommodationSelection(accommodation.id)}>
              <input
                type="radio"
                checked={selectedAccommodation === accommodation.id}
                onChange={() => {}}
                className="mr-2"
                readOnly
              />
              {`${accommodation.roomNumber}, ${accommodation.address}, ${accommodation.roomType} ${accommodation.occupantType}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AccommodationSelect;
