"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import SingleStudentSelect from '@/components/select/singleStudentSelect';
import IntakeGroupSelect from '@/components/select/singleIntakeGroupSelect';
import { useChangeStudentIntakeGroupMutation } from '@/lib/features/changeStudentInakegroup/changeStudentIntakegroup';

const ChangeStudentIntakeGroupPage = () => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedIntakeGroup, setSelectedIntakeGroup] = useState('');
  const [changeStudentIntakeGroup, { isLoading }] = useChangeStudentIntakeGroupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await changeStudentIntakeGroup({
        studentId: selectedStudent,
        newIntakeGroupId: selectedIntakeGroup,
      }).unwrap();
      alert('Student intake group updated successfully!');
      router.push('/admin/students');
    } catch (error) {
      console.error('Failed to update student intake group:', error);
      alert('Failed to update student intake group. Please try again.');
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <p className="mt-2 text-base text-gray-600">Select a student and a new intake group to update.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Student selection */}
          <SingleStudentSelect selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
          {/* Intake Group selection */}
          <IntakeGroupSelect selectedIntakeGroup={selectedIntakeGroup} setSelectedIntakeGroup={setSelectedIntakeGroup} />
        </div>
        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Intake Group'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/settings/student-intake-group')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ChangeStudentIntakeGroupPage;
