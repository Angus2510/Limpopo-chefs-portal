"use client"
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetCampusesQuery } from '@/lib/features/campus/campusApiSlice';

function CampusSelect({ selectedCampus, setSelectedCampus }) {  // Single select
    const [isOpen, setIsOpen] = useState(false);
    const { data: campusesData, isLoading, isError, error } = useGetCampusesQuery();

    const campuses = campusesData ? Object.values(campusesData.entities) : [];

    const handleCampusSelection = (campusId) => {
        setSelectedCampus(campusId);
        setIsOpen(false); // Close dropdown on selection
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.message}</p>;

    const selectedCampusTitle = campuses.find(campus => campus.id === selectedCampus)?.title || 'Select a campus';

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Campus *</label> 
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                <span className="text-gray-700">{selectedCampusTitle}</span>
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
                    {campuses.map(campus => (
                        <li key={campus.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCampusSelection(campus.id)}>
                            <input
                                type="radio"
                                checked={selectedCampus === campus.id}
                                onChange={() => {}}
                                className="mr-2"
                                readOnly
                            />
                            {campus.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CampusSelect;
