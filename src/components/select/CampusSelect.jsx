import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetCampusesQuery } from '@/lib/features/campus/campusApiSlice';

function CampusSelect({ selectedCampuses = [], setSelectedCampuses }) {  // Default parameter ensures array
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: campusesData, isLoading, isError, error } = useGetCampusesQuery();
    const dropdownRef = useRef(null);

    const campuses = campusesData ? Object.values(campusesData.entities) : [];

    const toggleCampusSelection = (campusId) => {
        setSelectedCampuses(prev => (
            prev.includes(campusId) ? prev.filter(id => id !== campusId) : [...prev, campusId]
        ));
    };

    const removeCampusSelection = (campusId) => {
        setSelectedCampuses(prev => prev.filter(id => id !== campusId));
    };

    const filteredCampuses = campuses.filter(campus => {
        const searchLower = searchTerm.toLowerCase();
        return campus.title.toLowerCase().includes(searchLower);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Campuses</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                {selectedCampuses.map(campusId => {  // Now always an array
                    const campus = campuses.find(c => c.id === campusId);
                    return campus && (
                        <div key={campusId} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <span className="text-gray-700">{campus.title}</span>
                            <FiX className="cursor-pointer text-gray-700" onClick={() => removeCampusSelection(campusId)} />
                        </div>
                    );
                })}
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
                        placeholder="Search campuses..."
                        className="w-full p-2 border-b border-gray-300"
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredCampuses.map(campus => (
                            <li key={campus.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleCampusSelection(campus.id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedCampuses.includes(campus.id)}
                                    onChange={() => {}}
                                    className="mr-2"
                                    readOnly
                                />
                                {campus.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CampusSelect;
