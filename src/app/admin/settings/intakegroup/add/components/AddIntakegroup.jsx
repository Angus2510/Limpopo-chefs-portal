"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import CampusSelect from '@/components/select/CampusSelect'; 
import OutcomeSelect from '@/components/select/OutcomeSelect'; 
import { useAddNewIntakeGroupMutation } from '@/lib/features/intakegroup/intakeGroupApiSlice'; // Ensure the path is correct

const AddIntakeGroup = () => {
  const router = useRouter();
  const [intakeGroupName, setIntakeGroupName] = useState('');
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [addNewIntakeGroup, { isLoading }] = useAddNewIntakeGroupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNewIntakeGroup({
        title: intakeGroupName,
        campus: selectedCampuses,
        outcome: selectedOutcomes,
      }).unwrap();
      alert('Intake group added successfully!');
      router.push('/admin/settings/intakegroup');
    } catch (error) {
      console.error('Failed to add intake group:', error);
      alert('Failed to add intake group. Please try again.');
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Add Intake Group</h4>
      <p className="mt-2 text-base text-gray-600">Fill in the details below to add a new intake group.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Intake Group name input */}
          <div>
            <label htmlFor="intakeGroupName" className="block text-sm font-medium text-gray-700">Intake Group Name</label>
            <input
              type="text"
              id="intakeGroupName"
              value={intakeGroupName}
              onChange={(e) => setIntakeGroupName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>
          {/* Campus selection */}
          <CampusSelect selectedCampuses={selectedCampuses} setSelectedCampuses={setSelectedCampuses} />
          {/* Outcome selection */}
          <OutcomeSelect selectedOutcomes={selectedOutcomes} setSelectedOutcomes={setSelectedOutcomes} />
        </div>
        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Intake Group'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/settings/intakegroup')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddIntakeGroup;
