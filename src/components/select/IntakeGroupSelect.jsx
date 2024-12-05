import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetIntakeGroupsQuery } from '@/lib/features/intakegroup/intakeGroupApiSlice';

function IntakeGroupSelect({ selectedIntakeGroups, setSelectedIntakeGroups }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: intakeGroupsData, isLoading, isError, error } = useGetIntakeGroupsQuery();
    const dropdownRef = useRef(null);

    const intakeGroups = intakeGroupsData ? Object.values(intakeGroupsData.entities) : [];

    const toggleIntakeGroupSelection = (groupId) => {
        setSelectedIntakeGroups(prev => (
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        ));
    };

    const removeIntakeGroupSelection = (groupId) => {
        setSelectedIntakeGroups(prev => prev.filter(id => id !== groupId));
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

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Intake Groups</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-dmgray-700 rounded-md bg-white dark:bg-dmgray-900 shadow-sm">
                {(selectedIntakeGroups || []).map(groupId => {
                    const group = intakeGroups.find(g => g.id === groupId);
                    return group && (
                        <div key={groupId} className="flex items-center gap-1 bg-gray-100 dark:bg-dmgray-700  px-2 py-1 rounded">
                            <span className="text-gray-700 dark:text-dmgray-200">{group.title}</span>
                            <FiX className="cursor-pointer text-gray-700 dark:text-dmgray-200" onClick={() => removeIntakeGroupSelection(groupId)} />
                        </div>
                    );
                })}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="ml-auto focus:outline-none"
                >
                    {isOpen ? <FiChevronUp className="inline-block text-gray-700 dark:text-dmgray-200" /> : <FiChevronDown className="inline-block text-gray-700 dark:text-dmgray-200" />}
                </button>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 dark:border-dmgray-700 rounded-md bg-white dark:bg-dmgray-900 shadow-lg">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search intake groups..."
                       className="w-full p-2 border-b border-gray-300 dark:border-dmgray-700 bg-white dark:bg-dmgray-900 text-gray-700 dark:text-dmgray-200 placeholder:text-gray-400 dark:placeholder-dmgray-400"
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredIntakeGroups.map(group => (
                            <li key={group.id} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-dmgray-700 cursor-pointer"
                                onClick={() => toggleIntakeGroupSelection(group.id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedIntakeGroups.includes(group.id)}
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
