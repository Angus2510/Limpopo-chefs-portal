import Card from "@/components/card";
import React from "react";


const EditBLock = () => {
  return (
    <Card className={"w-full h-full p-3"}>
        <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Important Information
        </h4>
      </div>

      <div className="px-2">
        <label className="block text-sm font-medium text-gray-700">
          Important Information
        </label>
        <textarea
          className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
          value=""
          placeholder="Enter important information here..."
        ></textarea>
      </div>
      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          Save
        </button>
      </div>
    </Card>
  )
}

export default EditBLock