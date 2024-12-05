// src/app/admin/students/[id]/components/ActionList.jsx

import Card from "@/components/card";
import React from "react";
import { FiEdit, FiDollarSign, FiSlash, FiMail } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import DisableStudentDropdown from "./DisableStudentDropdown";

const ActionList = ({ studentId, isDisabled }) => {
  const router = useRouter();

  const handleEditButtonClick = () => {
    router.push(`/admin/students/edit/${studentId}`);
  };

  const handleFeeButtonClick = () => {
    router.push(`/admin/finance/collect/${studentId}`);
  };

  const handleDisable = (reason) => {
    alert(`Student disabled for reason: ${reason}`);
  };

  const handleEmailButtonClick = () => {
    alert('User reset link emailed');
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
          <p className="text-sm text-gray-600">Edit</p>
          <button
            className="text-blue-500 hover:text-blue-700 flex items-center mt-2"
            onClick={handleEditButtonClick}
          >
            <FiEdit className="mr-2" />
            Edit Student
          </button>
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Collect Fees</p>
          <button
            className="text-blue-500 hover:text-blue-700 flex items-center mt-2"
            onClick={handleFeeButtonClick}
          >
            <FiDollarSign className="mr-2" />
            Collect Fees
          </button>
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none relative">
        <p className="text-sm text-gray-600">{isDisabled ? 'Activate' : 'Suspend'}</p>
          <DisableStudentDropdown
            button={
              <button className={`${isDisabled ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} flex items-center mt-2`}>
                <FiSlash className="mr-2" />
                {isDisabled ? 'Activate Student' : 'Suspend Student'}
              </button>
            }
            studentId={studentId}
            isDisabled={isDisabled}
          />
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Email</p>
          <button
            className="text-blue-500 hover:text-blue-700 flex items-center mt-2"
            onClick={handleEmailButtonClick}
          >
            <FiMail className="mr-2" />
            Email Reset Link
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ActionList;
