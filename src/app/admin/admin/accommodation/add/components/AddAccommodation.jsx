"use client"; // Indicates this is a client-side React component.

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js hook for navigation.
import Card from "@/components/card"; // Custom Card component for layout/styling.
import StudentSelect from "@/components/select/StudentSelect"; // Custom component for selecting students.
import { useAddNewAccommodationMutation } from "@/lib/features/accommodation/accommodationApiSlice"; // API slice to handle adding new accommodation.

const AddAccommodation = () => {
  const router = useRouter(); // Hook to handle navigation within the app.

  // State variables to track form inputs and selected students.
  const [roomNumber, setRoomNumber] = useState("");
  const [address, setAddress] = useState("");
  const [roomType, setRoomType] = useState("");
  const [occupantType, setOccupantType] = useState("Single"); // Default occupant type is "Single".
  const [occupantNumber, setOccupantNumber] = useState(1); // Default to one occupant.
  const [costPerBed, setCostPerBed] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Custom hook for API call to add accommodation, with loading and error states.
  const [addNewAccommodation, { isLoading, isError, error }] =
    useAddNewAccommodationMutation();

  // Handles the "Cancel" button click, redirecting the user to the accommodation list page.
  const handleCancelClick = () => {
    router.push("/admin/admin/accommodation");
  };

  // Effect to update the number of occupants based on the selected occupant type.
  useEffect(() => {
    if (occupantType === "Single") {
      setOccupantNumber(1); // Single rooms always have 1 occupant.
    } else if (occupantType === "Sharing") {
      setOccupantNumber(2); // Sharing rooms typically have 2 occupants.
    }
  }, [occupantType]); // Re-runs when occupantType changes.

  // Handles form submission to add new accommodation.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behaviour.

    // Validations to ensure all required fields are filled and valid.
    if (!roomNumber.trim()) {
      alert("Please enter a room number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter an address.");
      return;
    }

    if (!roomType) {
      alert("Please select a room type.");
      return;
    }

    if (!costPerBed.trim()) {
      alert("Please enter the cost per bed.");
      return;
    }

    if (selectedStudents.length > occupantNumber) {
      alert(
        `The number of selected students (${selectedStudents.length}) exceeds the number of occupants (${occupantNumber}).`
      );
      return;
    }

    // Prepare data for API submission.
    const formData = {
      roomNumber,
      address,
      roomType,
      occupantType,
      numberOfOccupants: occupantNumber,
      costPerBed,
      occupantIds: selectedStudents,
    };

    console.log("Form Data:", formData); // Debugging: log form data.

    try {
      // Submit form data to the API.
      await addNewAccommodation(formData).unwrap();
      alert(`Accommodation with room number ${roomNumber} added successfully!`);
      router.push("/admin/admin/accommodation"); // Redirect on success.
    } catch (err) {
      console.error("Failed to add accommodation:", err); // Log error.
      alert("Failed to add accommodation. Please try again."); // Notify user of failure.
    }
  };

  return (
    // Card component to wrap the form and provide styling.
    <Card className="bg-white p-6 rounded-2xl shadow-xl">
      <h4 className="text-xl font-bold text-navy-700">Add Accommodation</h4>
      <p className="mt-2 text-base text-gray-600">
        Enter the details of the new accommodation.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Input field for room number */}
          <div>
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Input field for address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Dropdown for room type */}
          <div>
            <label
              htmlFor="roomType"
              className="block text-sm font-medium text-gray-700"
            >
              Room Gender
            </label>
            <select
              id="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            >
              <option value="">Select a room type</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Dropdown for occupant type */}
          <div>
            <label
              htmlFor="occupantType"
              className="block text-sm font-medium text-gray-700"
            >
              Room Type
            </label>
            <select
              id="occupantType"
              value={occupantType}
              onChange={(e) => setOccupantType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            >
              <option value="Single">Single</option>
              <option value="Sharing">Sharing</option>
              <option value="En suite">En suite</option>
            </select>
          </div>

          {/* Conditional input for the number of occupants */}
          {occupantType !== "Single" && (
            <div>
              <label
                htmlFor="occupantNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Occupants
              </label>
              <input
                type="number"
                id="occupantNumber"
                value={occupantNumber}
                onChange={(e) => setOccupantNumber(parseInt(e.target.value))}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
          )}

          {/* Input for cost per bed */}
          <div>
            <label
              htmlFor="costPerBed"
              className="block text-sm font-medium text-gray-700"
            >
              Cost Per Bed
            </label>
            <input
              type="text"
              id="costPerBed"
              value={costPerBed}
              onChange={(e) => setCostPerBed(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              required
            />
          </div>

          {/* Component for selecting students */}
          <div>
            <StudentSelect
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
            />
          </div>
        </div>

        {/* Buttons for submitting or cancelling */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 mr-4"
          >
            Add Accommodation
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

export default AddAccommodation; // Export the component for use in other parts of the application.
