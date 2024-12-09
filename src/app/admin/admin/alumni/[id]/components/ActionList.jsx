import React from "react"; // Import React for JSX syntax
import { FiUserCheck } from "react-icons/fi"; // Import icon from react-icons
import Card from "@/components/card"; // Import Card component for styling
import { useToggleAlumniStatusMutation } from "@/lib/features/alumni/alumniApiSlice"; // Import the mutation hook to toggle alumni status

const ActionList = ({ studentId }) => {
  // Component to handle student settings, receives studentId as a prop
  const [toggleAlumniStatus, { isLoading }] = useToggleAlumniStatusMutation(); // Initialize mutation hook to toggle alumni status

  // Function to handle the action of moving a student from alumni status
  const handleMoveFromAlumni = () => {
    toggleAlumniStatus(studentId); // Call the mutation hook with the studentId to toggle the status
  };

  return (
    <Card className="w-full h-full p-3">
      {" "}
      {/* Card component to wrap the content */}
      <div className="mt-2 mb-8 w-full">
        {/* Title section */}
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Student Settings
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4 px-2">
        {" "}
        {/* Grid layout for the buttons */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          {/* Action button to move the student from alumni */}
          <p className="text-sm text-gray-600">Move from Alumni</p>
          <button
            className={`${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "text-green-500 hover:text-green-700"
            } flex items-center mt-2`}
            onClick={handleMoveFromAlumni} // Trigger handleMoveFromAlumni function on button click
            disabled={isLoading} // Disable the button if the request is in progress
          >
            <FiUserCheck className="mr-2" /> {/* Alumni check icon */}
            {isLoading ? "Moving..." : "Move from Alumni"}{" "}
            {/* Display loading text or action text */}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ActionList;
