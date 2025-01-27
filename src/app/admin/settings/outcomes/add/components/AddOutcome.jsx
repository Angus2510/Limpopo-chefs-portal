'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import { useAddNewOutcomeMutation } from '@/lib/features/outcome/outcomeApiSlice';

const AddOutcome = () => {
  const router = useRouter();
  const [outcomeName, setOutcomeName] = useState('');
  const [outcomeType, setOutcomeType] = useState('');

  const [addNewOutcome, { isLoading }] = useAddNewOutcomeMutation();

  const handleCancelClick = () => {
    router.push('/admin/settings/outcomes');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!outcomeName.trim()) {
      alert('Please enter an outcome name.');
      return;
    }

    if (!outcomeType) {
      alert('Please select an outcome type.');
      return;
    }

    try {
      await addNewOutcome({ title: outcomeName, type: outcomeType }).unwrap();
      alert(`Outcome "${outcomeName}" added successfully!`);
      router.push('/admin/settings/outcomes');
    } catch (error) {
      console.error('Failed to add outcome: ', error);
      alert('Failed to add outcome. Please try again.');
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Add Outcome</h4>
      <p className="mt-2 text-base text-gray-600">Enter the name and select the type of the new outcome.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="outcomeName" className="block text-sm font-medium text-gray-700">Outcome Name</label>
            <input
              type="text"
              id="outcomeName"
              value={outcomeName}
              onChange={e => setOutcomeName(e.target.value)}
             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
              required
            />
          </div>
          
          <div>
            <label htmlFor="outcomeType" className="block text-sm font-medium text-gray-700">Outcome Type</label>
            <select
              id="outcomeType"
              value={outcomeType}
              onChange={e => setOutcomeType(e.target.value)}
             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6"
              required
            >
              <option value="">Select an outcome type</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Exams/Well">Exams/Well</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Outcome'}
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddOutcome;
