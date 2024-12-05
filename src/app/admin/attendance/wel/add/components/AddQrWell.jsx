"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import CampusSelect from '@/components/select/CampusSelect';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';
import { useAddWelAttendanceMutation } from '@/lib/features/attendance/welAttendanceApiSlice';

const GenerateAttendance = () => {
  const router = useRouter();
  const [addWelAttendance] = useAddWelAttendanceMutation();

  const [selectedIntakeGroups, setSelectedIntakeGroups] = useState([]);
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [attendanceFromDate, setAttendanceFromDate] = useState('');
  const [attendanceToDate, setAttendanceToDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      intakeGroup: selectedIntakeGroups,
      campuses: selectedCampuses,
      attendanceDate: attendanceFromDate,
      endDate: attendanceToDate,
    };
    console.log('Form Data:', formData);
    try {
      await addWelAttendance(formData);
      alert('WEL Attendance added successfully');
      router.push('/admin/attendance/wel');
    } catch (error) {
      console.error('Failed to add WEL attendance', error);
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Generate Attendance</h4>
      <p className="mt-2 text-base text-gray-600">Fill in the details below to generate attendance.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <IntakeGroupSelect
            selectedIntakeGroups={selectedIntakeGroups}
            setSelectedIntakeGroups={setSelectedIntakeGroups}
          />
          <CampusSelect
            selectedCampuses={selectedCampuses}
            setSelectedCampuses={setSelectedCampuses}
          />
          <div>
            <label htmlFor="attendanceFromDate" className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              id="attendanceFromDate"
              value={attendanceFromDate}
              onChange={(e) => setAttendanceFromDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="attendanceToDate" className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              id="attendanceToDate"
              value={attendanceToDate}
              onChange={(e) => setAttendanceToDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
          >
            Generate Attendance
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/attendance/wel')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default GenerateAttendance;
