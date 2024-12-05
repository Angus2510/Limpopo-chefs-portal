"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetIntakeGroupsQuery } from '@/lib/features/intakegroup/intakeGroupApiSlice';

function IntakeGroupSelect({ selectedIntakeGroup, setSelectedIntakeGroup }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: intakeGroupsData, isLoading, isError, error } = useGetIntakeGroupsQuery();
    const dropdownRef = useRef(null);

    const intakeGroups = intakeGroupsData ? Object.values(intakeGroupsData.entities) : [];

    const handleIntakeGroupSelection = (groupId) => {
        setSelectedIntakeGroup(groupId);
        setIsOpen(false); // Close dropdown on selection
    };

    const filteredIntakeGroups = intakeGroups.filter(group => {
        const searchLower = searchTerm.toLowerCase();
        return group.title.toLowerCase().includes(searchLower);
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.message}</p>;

    const selectedIntakeGroupTitle = intakeGroups.find(group => group.id === selectedIntakeGroup)?.title || 'Select an intake group';

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Intake Group *</label>
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                <span className="text-gray-700">{selectedIntakeGroupTitle}</span>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="ml-auto focus:outline-none"
                >
                    {isOpen ? <FiChevronUp className="inline-block text-gray-700" /> : <FiChevronDown className="inline-block text-gray-700" />}
                </button>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search intake groups..."
                        className="w-full p-2 border-b border-gray-300"
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredIntakeGroups.map(group => (
                            <li key={group.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleIntakeGroupSelection(group.id)}>
                                <input
                                    type="radio"
                                    checked={selectedIntakeGroup === group.id}
                                    onChange={() => {}}
                                    className="mr-2"
                                    readOnly
                                />
                                {group.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default IntakeGroupSelect;
