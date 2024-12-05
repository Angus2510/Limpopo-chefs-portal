'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/card';
import StudentSelect from '@/components/select/StudentSelect';
import { useGetAccommodationByIdQuery, useUpdateAccommodationMutation } from '@/lib/features/accommodation/accommodationApiSlice';

const EditAccommodation = ({id}) => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAccommodationByIdQuery(id);
  const [updateAccommodation, { isLoading: isUpdating }] = useUpdateAccommodationMutation();

  const [roomNumber, setRoomNumber] = useState('');
  const [address, setAddress] = useState('');
  const [roomType, setRoomType] = useState('');
  const [occupantType, setOccupantType] = useState('Single');
  const [occupantNumber, setOccupantNumber] = useState(1);
  const [costPerBed, setCostPerBed] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (data) {
      const accommodation = data.entities[id];
      if (accommodation) {
        console.log('Accommodation data:', accommodation);

        setRoomNumber(accommodation.roomNumber || '');
        setAddress(accommodation.address || '');
        setRoomType(accommodation.roomType || '');
        setOccupantType(accommodation.occupantType || 'Single');
        setOccupantNumber(accommodation.numberOfOccupants || 1);
        setCostPerBed(accommodation.costPerBed || '');
        setSelectedStudents(accommodation.occupants ? accommodation.occupants.map((occupant) => occupant._id) : []);
      }
    }
  }, [data, id]);

  const handleCancelClick = () => {
    router.push('/admin/accommodation');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length > occupantNumber) {
      alert('The number of selected students exceeds the number of occupants.');
      return;
    }

    const formData = {
      roomNumber,
      address,
      roomType,
      occupantType,
      numberOfOccupants: occupantNumber,
      costPerBed,
      occupantIds: selectedStudents,
    };

    console.log('Form Data:', formData);

    try {
      await updateAccommodation({ id, ...formData }).unwrap();
      alert(`Accommodation with room number ${roomNumber} updated successfully!`);
      router.push('/admin/admin/accommodation');
    } catch (err) {
      console.error('Failed to update accommodation:', err);
      alert('Failed to update accommodation. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading accommodation: {error.message}</div>;

  return (
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Edit Accommodation</h4>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Room number input */}
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              type="text"
              id="roomNumber"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Address input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Room type input */}
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Gender</label>
            <select
              id="roomType"
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            >
              <option value="">Select a room type</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Occupant type input */}
          <div>
            <label htmlFor="occupantType" className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              id="occupantType"
              value={occupantType}
              onChange={e => setOccupantType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            >
              <option value="Single">Single</option>
              <option value="Sharing">Sharing</option>
              <option value="En suite">En suite</option>
            </select>
          </div>

          {/* Occupant number input - conditionally render */}
          {occupantType === 'Sharing' && (
            <div>
              <label htmlFor="occupantNumber" className="block text-sm font-medium text-gray-700">Number of Occupants</label>
              <input
                type="number"
                id="occupantNumber"
                value={occupantNumber}
                onChange={e => setOccupantNumber(parseInt(e.target.value))}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
          )}

          {/* Cost per bed input */}
          <div>
            <label htmlFor="costPerBed" className="block text-sm font-medium text-gray-700">Cost Per Bed</label>
            <input
              type="text"
              id="costPerBed"
              value={costPerBed}
              onChange={e => setCostPerBed(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Student select input */}
          <div>
            <StudentSelect selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
          </div>
        </div>
        {/* Submit and cancel buttons */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
          >
            Update Accommodation
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

export default EditAccommodation;
