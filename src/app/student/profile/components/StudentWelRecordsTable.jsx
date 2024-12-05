'use client';

import React, { useState, useEffect } from 'react';
import { useGetWelRecordsByStudentIdQuery } from '@/lib/features/students/studentWelRecordApiSlice';

const StudentWelRecordsTable = ({ studentId }) => {
    const { data: welRecords, error: fetchError, isLoading } = useGetWelRecordsByStudentIdQuery(studentId);
    const [rows, setRows] = useState([{
        establishmentName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        totalHours: '',
        establishmentContact: '',
        evaluated: false
    }]);

    useEffect(() => {
        if (welRecords) {
            const initialRows = welRecords
                .filter(record => record !== null && record !== undefined)
                .map(record => ({
                    _id: record._id,
                    establishmentName: record.establishmentName || '',
                    startDate: record.startDate ? record.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    endDate: record.endDate ? record.endDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    totalHours: record.totalHours || '',
                    establishmentContact: record.establishmentContact || '',
                    evaluated: record.evaluated || false
                }));
            setRows(initialRows);
        }
    }, [welRecords]);

    return (
        <div className="mt-8 h-full overflow-x-auto">
            {isLoading && <p>Loading...</p>}
            {fetchError && <p>Error loading W.E.L records: {fetchError.message}</p>}
            <table className="w-full text-sm text-gray-600" id="WelRecordsTable">
                <thead>
                    <tr>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Establishment Name</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Start Date</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">End Date</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Total Hours</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Establishment Contact</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Evaluated</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-200">{row.establishmentName}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.startDate}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.endDate}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.totalHours}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.establishmentContact}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.evaluated ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentWelRecordsTable;
