import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetStudentsQuery } from '@/lib/features/students/studentsApiSlice'; 

function SingleStudentSelect({ selectedStudent, setSelectedStudent }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: studentsData, isLoading, isError, error } = useGetStudentsQuery();

    const students = studentsData ? Object.values(studentsData.entities) : [];

    const handleStudentSelection = (studentId) => {
        setSelectedStudent(studentId);
        setIsOpen(false);
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

    const selectedStudentData = students.find(s => s.id === selectedStudent);
    const selectedStudentDisplayName = selectedStudentData ? 
        `(${selectedStudentData.admissionNumber}) ${selectedStudentData.profile?.firstName || 'Unnamed'} ${selectedStudentData.profile?.lastName || ''}` 
        : 'Select a student';

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <div 
                className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-gray-700">{selectedStudentDisplayName}</span>
                {isOpen ? <FiChevronUp className="inline-block text-gray-700" /> : <FiChevronDown className="inline-block text-gray-700" />}
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
                                    onClick={() => handleStudentSelection(student.id)}>
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

export default SingleStudentSelect;
