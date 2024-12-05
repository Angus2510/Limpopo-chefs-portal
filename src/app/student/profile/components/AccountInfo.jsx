import React from "react";
import Card from "@/components/card";
import { FiEdit, FiDollarSign, FiSlash, FiMail } from "react-icons/fi";

const AccountInfo = () => {
  const handleEdit = () => {
    // Handle edit action
  };

  const handleCollectFees = () => {
    // Handle collect fees action
  };

  const handleDisable = () => {
    // Handle disable action
  };

  const handleSendLoginDetails = (recipient) => {
    // Handle sending login details action
    console.log(`Sending login details to ${recipient}`);
  };

  return (
    <Card className={"w-full h-full p-3"}>
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Account Information
        </h4>
      </div>
      {/* Cards */}

      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Arrears</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">
            R0.0
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfo;
