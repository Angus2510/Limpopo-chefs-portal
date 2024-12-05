import React, { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetStudentsQuery } from '@/lib/features/students/studentsApiSlice'; 

function StudentSelect({ selectedStudents, setSelectedStudents }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: studentsData, isLoading, isError, error } = useGetStudentsQuery();

    const students = studentsData ? Object.values(studentsData.entities) : [];

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev => (
            prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
        ));
    };

    const removeStudentSelection = (studentId) => {
        setSelectedStudents(prev => prev.filter(id => id !== studentId));
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.profile?.firstName?.toLowerCase().includes(searchLower) ||
            student.profile?.lastName?.toLowerCase().includes(searchLower) ||
            student.admissionNumber?.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error?.message}</p>;

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                {selectedStudents.map(studentId => {
                    const student = students.find(s => s.id === studentId);
                    const displayName = `(${student?.admissionNumber || 'N/A'}) ${student?.profile?.firstName || 'Unnamed'} ${student?.profile?.lastName || ''}`;
                    return (
                        <div key={studentId} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <span className="text-gray-700">{displayName}</span>
                            <FiX className="cursor-pointer text-gray-700" onClick={() => removeStudentSelection(studentId)} />
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
                        placeholder="Search students..."
                        className="w-full p-2 border-b border-gray-300"
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredStudents.map(student => {
                            const displayName = `(${student.admissionNumber}) ${student.profile?.firstName || 'Unnamed'} ${student.profile?.lastName || ''}`;
                            return (
                                <li key={student.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => toggleStudentSelection(student.id)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => {}}
                                        className="mr-2"
                                        readOnly
                                    />
                                    {displayName}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default StudentSelect;
