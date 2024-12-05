'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import { useGetOutcomeByIdQuery, useUpdateOutcomeMutation } from '@/lib/features/outcome/outcomeApiSlice';

const EditOutcome = ({ id }) => {
  const router = useRouter();
  const { data: outcomeData, isLoading, isError, error } = useGetOutcomeByIdQuery(id);
  const [updateOutcome, { isLoading: isUpdating }] = useUpdateOutcomeMutation();

  const [outcomeName, setOutcomeName] = useState('');
  const [outcomeType, setOutcomeType] = useState('');
  const [outcomeHidden, setOutcomeHidden] = useState(false);

  useEffect(() => {
    if (outcomeData) {
      const outcome = outcomeData.entities[id];
      setOutcomeName(outcome.title);
      setOutcomeType(outcome.type);
      setOutcomeHidden(outcome.hidden !== undefined ? outcome.hidden : false);
    }
  }, [outcomeData, id]);

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
      await updateOutcome({
        id,
        formData: { title: outcomeName, type: outcomeType, hidden: outcomeHidden },
      }).unwrap();
      alert(`Outcome "${outcomeName}" updated successfully!`);
      router.push('/admin/settings/outcomes');
    } catch (error) {
      console.error('Failed to update outcome:', error);
      alert('Failed to update outcome. Please try again.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Edit Outcome</h4>
      <p className="mt-2 text-base text-gray-600">Update the details of the outcome.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Outcome name input */}
          <div>
            <label htmlFor="outcomeName" className="block text-sm font-medium text-gray-700">Outcome Name</label>
            <input
              type="text"
              id="outcomeName"
              value={outcomeName}
              onChange={e => setOutcomeName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Outcome type select */}
          <div>
            <label htmlFor="outcomeType" className="block text-sm font-medium text-gray-700">Outcome Type</label>
            <select
              id="outcomeType"
              value={outcomeType}
              onChange={e => setOutcomeType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            >
              <option value="">Select an outcome type</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Exams/Well">Exams/Well</option>
            </select>
          </div>

          {/* Outcome hidden select */}
          <div>
            <label htmlFor="outcomeHidden" className="block text-sm font-medium text-gray-700">Hide Outcome</label>
            <select
              id="outcomeHidden"
              value={outcomeHidden ? 'true' : 'false'}
              onChange={e => setOutcomeHidden(e.target.value === 'true')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Outcome'}
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

export default EditOutcome;
