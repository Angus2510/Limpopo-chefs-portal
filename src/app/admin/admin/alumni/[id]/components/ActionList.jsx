import React from "react";
import { FiUserCheck } from "react-icons/fi";
import Card from "@/components/card";
import { useToggleAlumniStatusMutation } from "@/lib/features//alumni/alumniApiSlice";

const ActionList = ({ studentId }) => {
  const [toggleAlumniStatus, { isLoading }] = useToggleAlumniStatusMutation();

  const handleMoveFromAlumni = () => {
    toggleAlumniStatus(studentId);
  };

  return (
    <Card className="w-full h-full p-3">
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Student Settings
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Move from Alumni</p>
          <button
            className={`${isLoading ? 'opacity-50 cursor-not-allowed' : 'text-green-500 hover:text-green-700'} flex items-center mt-2`}
            onClick={handleMoveFromAlumni}
            disabled={isLoading}
          >
            <FiUserCheck className="mr-2" />
            {isLoading ? 'Moving...' : 'Move from Alumni'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ActionList;
