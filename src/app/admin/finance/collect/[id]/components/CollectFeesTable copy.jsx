import React, { useState } from 'react';

const CollectFeesTable = () => {
    const [rows, setRows] = useState([
        { description: '', debit: '', credit: '', balance: '' }
    ]);

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
        setRows([...rows, { description: '', debit: '', credit: '', balance: '' }]);
    };

    const handleSave = () => {
        // Implement save logic here
        console.log("Table saved:", rows);
    };

    return (
        <div className="mt-8 h-full overflow-x-auto">
            <table className="w-full text-sm text-gray-600" id="CollectFeesTable">
                <thead>
                    <tr>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                            Description</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                            Debit</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                            Credit</th>
                        <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                            Balance</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
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
