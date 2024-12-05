"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/card';
import CampusSelect from '@/components/select/sinlgeCampusSelect';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';
import { useAddNewQrAttendanceMutation } from '@/lib/features/attendance/qrAttendanceApiSlice';

const GenerateAttendance = () => {
  const router = useRouter();
  const [addNewQrAttendance, { isLoading, isSuccess, isError, error }] = useAddNewQrAttendanceMutation();

  // State variables to manage form data
  const [selectedIntakeGroups, setSelectedIntakeGroups] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');

  // Redirect to the attendance page if the QR code is successfully generated
  useEffect(() => {
    if (isSuccess) {
      router.push('/admin/attendance/qr');
    }
  }, [isSuccess, router]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoading) {
      const data = {
        intakeGroup: selectedIntakeGroups,
        campus: selectedCampus,
        attendanceDate: attendanceDate,
        type:'One Day',
      };

      try {
        const result = await addNewQrAttendance(data).unwrap();
        console.log('QR Attendance added successfully', result);
      } catch (err) {
        console.error('Failed to add QR attendance', err);
      }
    }
  };

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Generate Attendance</h4>
      <p className="mt-2 text-base text-gray-600">Fill in the details below to generate attendance.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Intake Group selection */}
          <IntakeGroupSelect
            selectedIntakeGroups={selectedIntakeGroups}
            setSelectedIntakeGroups={setSelectedIntakeGroups}
          />
          {/* Campus selection */}
          <CampusSelect
            selectedCampus={selectedCampus}
            setSelectedCampus={setSelectedCampus}
          />
          {/* Attendance date input */}
          <div>
            <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-700">Attendance Date</label>
            <input
              type="date"
              id="attendanceDate"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>
        </div>
        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
          >
            Generate Attendance
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/attendance')}
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
