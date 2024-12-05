"use client";

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetQualificationsQuery } from '@/lib/features/qualification/qualificationApiSlice';

function QualificationSelect({ selectedQualification, setSelectedQualification }) {  // Single select
    const [isOpen, setIsOpen] = useState(false);
    const { data: qualificationsData, isLoading, isError, error } = useGetQualificationsQuery();

    const qualifications = qualificationsData ? Object.values(qualificationsData.entities) : [];

    const handleQualificationSelection = (qualificationId) => {
        setSelectedQualification(qualificationId);
        setIsOpen(false); // Close dropdown on selection
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.message}</p>;

    const selectedQualificationTitle = qualifications.find(qualification => qualification.id === selectedQualification)?.title || 'Select a qualification';

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Qualification *</label> 
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                <span className="text-gray-700">{selectedQualificationTitle}</span>
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
                    {qualifications.map(qualification => (
                        <li key={qualification.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleQualificationSelection(qualification.id)}>
                            <input
                                type="radio"
                                checked={selectedQualification === qualification.id}
                                onChange={() => {}}
                                className="mr-2"
                                readOnly
                            />
                            {qualification.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default QualificationSelect;
