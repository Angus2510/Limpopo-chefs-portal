import React, { useState } from 'react';
import Card from "@/components/card";
import { FiEdit, FiTrash2, FiSlash, FiMail } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useToggleStaffActiveStatusMutation, useDeleteStaffMutation } from '@/lib/features/staff/staffApiSlice';
import ConfirmDeletePopup from '@/components/popup/ConfirmDeletePopup';

const ActionList = ({ staffId, isDisabled }) => {
  const router = useRouter();
  const [toggleStaffActiveStatus, { isLoading: isToggling }] = useToggleStaffActiveStatusMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [popupOpen, setPopupOpen] = useState(false);

  const handleEditButtonClick = () => {
    router.push(`/admin/settings/staff/edit/${staffId}`);
  };


  const handleDisable = async () => {
    try {
      await toggleStaffActiveStatus(staffId).unwrap();
      alert(`Staff status toggled successfully`);
    } catch (error) {
      console.error('Failed to toggle staff status:', error);
      alert('Failed to toggle staff status');
    }
  };

  const handleEmailButtonClick = () => {
    alert('User reset link emailed');
  };

  const handleDelete = () => {
    setPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStaff(staffId).unwrap();
      alert('Staff deleted successfully');
      setPopupOpen(false);
      router.push(`/admin/settings/staff/`);
    } catch (error) {
      console.error('Failed to delete staff:', error);
      alert('Failed to delete staff. Please try again.');
    }
  };

  return (
    <>
      <Card className="w-full h-full p-3">
        <div className="mt-2 mb-8 w-full">
          <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
            Staff Settings
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
              Edit Staff
            </button>
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

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Delete</p>
            <button
              className="text-red-500 hover:text-red-700 flex items-center mt-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <FiTrash2 className="mr-2" />
              Delete Staff
            </button>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none relative">
            <p className="text-sm text-gray-600">Disable</p>
            <button
              className={`flex items-center mt-2 ${isDisabled ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
              onClick={handleDisable}
              disabled={isToggling}
            >
              <FiSlash className="mr-2" />
              {isDisabled ? 'Enable Staff' : 'Disable Staff'}
            </button>
          </div>
        </div>
      </Card>

      <ConfirmDeletePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle="this staff member"
      />
    </>
  );
};

export default ActionList;
