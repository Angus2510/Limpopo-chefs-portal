import React, { useState, useEffect } from 'react';
import { useGetWelRecordsByStudentIdQuery, useAddWelRecordMutation } from '@/lib/features/students/studentWelRecordApiSlice';

const StudentWelRecordsTable = ({ studentId }) => {
    const { data: welRecords, error: fetchError, isLoading } = useGetWelRecordsByStudentIdQuery(studentId);
    const [addWelRecord, { error: updateError }] = useAddWelRecordMutation();
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

    const handleInputChange = (index, key, value) => {
        const newRows = [...rows];
        newRows[index][key] = value;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { establishmentName: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], totalHours: '', establishmentContact: '', evaluated: false }]);
    };

    const handleSave = async () => {
        try {
            await addWelRecord({ studentId, welRecords: rows }).unwrap();
            alert('W.E.L records saved successfully');
        } catch (err) {
            console.error('Failed to save W.E.L records:', err);
            alert('Failed to save W.E.L records');
        }
    };

    return (
        <div className="mt-8 h-full overflow-x-auto">
            {isLoading && <p>Loading...</p>}
            {fetchError && <p>No Well records found for student: {fetchError.message}</p>}
            {updateError && <p>Error updating W.E.L record: {updateError.message}</p>}
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
                            <td>
                                <input
                                    type="text"
                                    value={row.establishmentName}
                                    onChange={(e) => handleInputChange(index, 'establishmentName', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={row.startDate}
                                    onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={row.endDate}
                                    onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.totalHours}
                                    onChange={(e) => handleInputChange(index, 'totalHours', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.establishmentContact}
                                    onChange={(e) => handleInputChange(index, 'establishmentContact', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={row.evaluated}
                                    onChange={(e) => handleInputChange(index, 'evaluated', e.target.checked)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={handleAddRow} className="bg-green-300 text-white px-4 py-2 rounded mr-2">
                    Add Row
                </button>
                <button id="saveWelRecordsButton" onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </div>
    );
};

export default StudentWelRecordsTable;
