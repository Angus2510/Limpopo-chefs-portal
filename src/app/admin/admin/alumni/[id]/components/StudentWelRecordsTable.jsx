import React, { useState, useEffect } from "react";
import {
  useGetWelRecordsByStudentIdQuery,
  useAddWelRecordMutation,
} from "@/lib/features/students/studentWelRecordApiSlice";

// The main component that renders a table of W.E.L records for a student
const StudentWelRecordsTable = ({ studentId }) => {
  // Fetching the student's W.E.L records using the query hook
  const {
    data: welRecords,
    error: fetchError,
    isLoading,
  } = useGetWelRecordsByStudentIdQuery(studentId);

  // Mutation hook for adding or updating a W.E.L record
  const [addWelRecord, { error: updateError }] = useAddWelRecordMutation();

  // State to store the rows of the table, initializing with a default empty row
  const [rows, setRows] = useState([
    {
      establishmentName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      totalHours: "",
      establishmentContact: "",
      evaluated: false,
    },
  ]);

  // Effect hook to update the rows state when W.E.L records are fetched
  useEffect(() => {
    if (welRecords) {
      // Mapping the fetched records to match the table format
      const initialRows = welRecords
        .filter((record) => record !== null && record !== undefined)
        .map((record) => ({
          _id: record._id,
          establishmentName: record.establishmentName || "",
          startDate: record.startDate
            ? record.startDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
          endDate: record.endDate
            ? record.endDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
          totalHours: record.totalHours || "",
          establishmentContact: record.establishmentContact || "",
          evaluated: record.evaluated || false,
        }));
      setRows(initialRows); // Setting the rows with the mapped data
    }
  }, [welRecords]); // Re-run the effect when the W.E.L records change

  // Function to handle changes in input fields for each row
  const handleInputChange = (index, key, value) => {
    const newRows = [...rows]; // Create a copy of the rows
    newRows[index][key] = value; // Update the specific row with the new value
    setRows(newRows); // Update the state with the new rows
  };

  // Function to handle adding a new row to the table
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        establishmentName: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        totalHours: "",
        establishmentContact: "",
        evaluated: false,
      },
    ]);
  };

  // Function to save the W.E.L records (add or update them)
  const handleSave = async () => {
    try {
      // Calling the mutation to save the W.E.L records
      await addWelRecord({ studentId, welRecords: rows }).unwrap();
      alert("W.E.L records saved successfully"); // Success alert
    } catch (err) {
      console.error("Failed to save W.E.L records:", err);
      alert("Failed to save W.E.L records"); // Error alert
    }
  };

  return (
    <div className="mt-8 h-full overflow-x-auto">
      {/* Loading state */}
      {isLoading && <p>Loading...</p>}
      {/* Error state for fetching W.E.L records */}
      {fetchError && (
        <p>No Well records found for student: {fetchError.message}</p>
      )}
      {/* Error state for saving W.E.L records */}
      {updateError && <p>Error updating W.E.L record: {updateError.message}</p>}

      {/* The table for displaying W.E.L records */}
      <table className="w-full text-sm text-gray-600" id="WelRecordsTable">
        <thead>
          <tr>
            {/* Table headers */}
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              Establishment Name
            </th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              Start Date
            </th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              End Date
            </th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              Total Hours
            </th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              Establishment Contact
            </th>
            <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
              Evaluated
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping through rows and displaying each input for every record */}
          {rows.map((row, index) => (
            <tr key={index}>
              {/* Each cell contains an input field for editing the row data */}
              <td>
                <input
                  type="text"
                  value={row.establishmentName}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "establishmentName",
                      e.target.value
                    )
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.startDate}
                  onChange={(e) =>
                    handleInputChange(index, "startDate", e.target.value)
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.endDate}
                  onChange={(e) =>
                    handleInputChange(index, "endDate", e.target.value)
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.totalHours}
                  onChange={(e) =>
                    handleInputChange(index, "totalHours", e.target.value)
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.establishmentContact}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "establishmentContact",
                      e.target.value
                    )
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.evaluated}
                  onChange={(e) =>
                    handleInputChange(index, "evaluated", e.target.checked)
                  }
                  className="mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons to add a new row and save the records */}
      <div className="mt-4">
        <button
          onClick={handleAddRow}
          className="bg-green-300 text-white px-4 py-2 rounded mr-2"
        >
          Add Row
        </button>
        <button
          id="saveWelRecordsButton"
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default StudentWelRecordsTable;
