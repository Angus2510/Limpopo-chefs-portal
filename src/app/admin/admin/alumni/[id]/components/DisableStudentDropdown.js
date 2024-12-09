import { useEffect, useState, useRef } from "react"; // Import React hooks
import { useToggleStudentStatusMutation } from "@/lib/features/students/studentsApiSlice"; // Import the mutation to toggle student status

// Custom hook to detect clicks outside a component and close it when clicked outside
function useOutsideAlerter(ref, setX) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false); // Close the dropdown when a click happens outside
      }
    }
    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

const DisableStudentDropdown = ({ button, studentId, isDisabled }) => {
  const wrapperRef = useRef(null); // Create a ref for the dropdown container
  const [openWrapper, setOpenWrapper] = useState(false); // State to track if the dropdown is open
  const [reason, setReason] = useState(""); // State to store the reason for disabling the student
  const [toggleStudentStatus] = useToggleStudentStatusMutation(); // Mutation to toggle the student's status (disabled or active)

  // Call the custom hook to close the dropdown when clicking outside
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  // Handler for disabling or enabling the student
  const handleDisableClick = async () => {
    try {
      // Call the mutation with student ID and reason (if any)
      await toggleStudentStatus({
        id: studentId,
        reason: isDisabled ? "" : reason,
      }).unwrap();
      setOpenWrapper(false); // Close the dropdown after the action is performed
    } catch (error) {
      console.error("Failed to toggle student status:", error); // Log error if action fails
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-start">
      {/* Button to toggle the dropdown */}
      <div onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button} {/* The button passed as a prop */}
      </div>
      <div
        className={`absolute z-10 mt-2 left-0 transition-all duration-300 ease-in-out ${
          openWrapper ? "scale-100" : "scale-0" // Control dropdown visibility with scaling effect
        }`}
      >
        <div className="bg-white p-4 rounded shadow-lg">
          {/* Header of the dropdown */}
          <h2 className="text-xl mb-4">
            {isDisabled ? "Activate Student" : "Disable Student"}
          </h2>
          {/* Show reason input only if the student is not already disabled */}
          {!isDisabled && (
            <label className="block mb-2">
              Reason:
              {/* Dropdown to select the reason for disabling the student */}
              <select
                value={reason} // Bind the select value to state
                onChange={(e) => setReason(e.target.value)} // Update reason state when selected
                className="block w-full mt-1"
              >
                <option value="">Select a reason</option>
                <option value="Duplicate entry">Duplicate entry</option>
                <option value="Maternity leave">Maternity leave</option>
                <option value="Arrears Account">Arrears Account</option>
                <option value="Medical Reasons">Medical Reasons</option>
                <option value="Dropped Out">Dropped Out</option>
                <option value="De-Registered due to study agreement expired">
                  De-Registered due to study agreement expired
                </option>
                <option value="other">Other</option>
              </select>
            </label>
          )}
          {/* Button to trigger the action (disable/activate the student) */}
          <button
            onClick={handleDisableClick} // Call the handler when clicked
            className={`mt-4 px-4 py-2 ${
              isDisabled ? "bg-green-500" : "bg-red-500"
            } text-white rounded`}
          >
            {isDisabled ? "Activate" : "Disable"}{" "}
            {/* Change button text based on student status */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableStudentDropdown;
