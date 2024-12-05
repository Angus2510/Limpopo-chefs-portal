"use client"
import React, { useState, useEffect } from 'react';
import { useGetGuardianCollectedFeesQuery } from '@/lib/features/guardian/guardianApiSlice';
import Card from '@/components/card/index'

const CollectFeesTable = ({ guardianId }) => {
  const { data: collectedFees, error: fetchError, isLoading } = useGetGuardianCollectedFeesQuery(guardianId);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (collectedFees) {
      const initialRows = collectedFees.map(fee => ({
        _id: fee._id,
        description: fee.description || '',
        debit: fee.debit || '',
        credit: fee.credit || '',
        balance: fee.balance || '',
        transactionDate: fee.transactionDate || new Date().toISOString().split('T')[0],
      }));
      setRows(initialRows);
    }
  }, [collectedFees]);

  return (
  <Card 
  className='p-4'>
    <div className="mt-8 h-full overflow-x-auto">
      {isLoading && <p>Loading...</p>}
      {fetchError && <p>Error loading collected fees: {fetchError.message}</p>}
      <table className="w-full text-sm text-gray-600" id="CollectFeesTable">
        <thead>
          <tr>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Description</th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Debit</th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Credit</th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Balance</th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.description}</td>
              <td>{row.debit}</td>
              <td>{row.credit}</td>
              <td>{row.balance}</td>
              <td>{row.transactionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Card>
  );
};

export default CollectFeesTable;
