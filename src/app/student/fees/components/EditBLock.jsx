import Card from "@/components/card";
import React from "react";


const EditBLock = ({information}) => {
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
        <p
          className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          rows="4"
        >
          {information}
        </p>
      </div>
    </Card>
  )
}

export default EditBLock