import React, { useState, useEffect } from 'react';
import { useGetCollectedFeesByStudentIdQuery, useUpdateCollectedFeesMutation } from '@/lib/features/finance/collectFeesApiSlice';

const CollectFeesTable = ({ id }) => {
    const { data: collectedFees, error: fetchError, isLoading } = useGetCollectedFeesByStudentIdQuery(id);
    const [updateCollectedFees, { error: updateError }] = useUpdateCollectedFeesMutation();
    const [rows, setRows] = useState([{ description: '', debit: '', credit: '', balance: '', transactionDate: new Date().toISOString().split('T')[0] }]);

    useEffect(() => {
        if (collectedFees) {
            const initialRows = collectedFees.map(fee => ({
                _id: fee._id,
                description: fee.description || '',
                debit: fee.debit || '',
                credit: fee.credit || '',
                balance: fee.balance || '',
                transactionDate: fee.transactionDate ? fee.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0]
            }));
            setRows(initialRows);
        }
    }, [collectedFees]);

    const handleInputChange = (index, key, value) => {
        const newRows = [...rows];
        newRows[index][key] = value;
        if (key === 'debit' || key === 'credit') {
            const debitTotal = newRows.reduce((acc, row) => acc + (parseFloat(row.debit) || 0), 0);
            const creditTotal = newRows.reduce((acc, row) => acc + (parseFloat(row.credit) || 0), 0);
            newRows[index]['balance'] = debitTotal - creditTotal;
        }
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { description: '', debit: '', credit: '', balance: '', transactionDate: new Date().toISOString().split('T')[0] }]);
    };

    const handleDeleteRow = (index) => {
        const newRows = rows.filter((row, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };

    const handleSave = async () => {
        try {
            await updateCollectedFees({ studentId: id, collectedFees: rows }).unwrap();
            alert('Fees updated successfully');
        } catch (err) {
            console.error('Failed to update fees:', err);
            alert('Failed to update fees');
        }
    };

    return (
        <div className="mt-8 h-full overflow-x-auto">
            {isLoading && <p>Loading...</p>}
            {fetchError && <p>Error loading collected fees: {fetchError.message}</p>}
            {updateError && <p>Error updating collected fees: {updateError.message}</p>}
            <table className="w-full text-sm text-gray-600" id="CollectFeesTable">
                <thead>
                    <tr>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Description</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Debit</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Credit</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Balance</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Transaction Date</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={row.description}
                                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.debit}
                                    onChange={(e) => handleInputChange(index, 'debit', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.credit}
                                    onChange={(e) => handleInputChange(index, 'credit', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>{row.balance}</td>
                            <td>
                                <input
                                    type="date"
                                    value={row.transactionDate}
                                    onChange={(e) => handleInputChange(index, 'transactionDate', e.target.value)}
                                    className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </td>
                            <td>
                                <button onClick={() => handleDeleteRow(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={handleAddRow} className="bg-green-400 text-white px-4 py-2 rounded mr-2">
                    Add Row
                </button>
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </div>
    );
};

export default CollectFeesTable;
