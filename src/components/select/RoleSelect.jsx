import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetRolesQuery } from '@/lib/features/roles/rolesApiSlice';

function RoleSelect({ selectedRoles = [], setSelectedRoles }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: rolesData, isLoading, isError, error } = useGetRolesQuery();
    const dropdownRef = useRef(null);

    const roles = rolesData ? Object.values(rolesData.entities) : [];

    const toggleRoleSelection = (roleId) => {
        setSelectedRoles(prev => (
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        ));
    };

    const removeRoleSelection = (roleId) => {
        setSelectedRoles(prev => prev.filter(id => id !== roleId));
    };

    const filteredRoles = roles.filter(role => {
        const searchLower = searchTerm.toLowerCase();
        return role.roleName.toLowerCase().includes(searchLower);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                {selectedRoles.map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role && (
                        <div key={roleId} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <span className="text-gray-700">{role.roleName}</span>
                            <FiX className="cursor-pointer text-gray-700" onClick={() => removeRoleSelection(roleId)} />
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
                        placeholder="Search roles..."
                        className="w-full p-2 border-b border-gray-300"
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredRoles.map(role => (
                            <li key={role.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleRoleSelection(role.id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role.id)}
                                    onChange={() => {}}
                                    className="mr-2"
                                    readOnly
                                />
                                {role.roleName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default RoleSelect;
