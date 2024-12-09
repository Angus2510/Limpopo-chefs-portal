import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function CombinedDurationSelector({ hours, setHours, minutes, setMinutes }) {
  // State to control the visibility of the dropdown selector
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null); // Reference to the selector div to manage clicks outside

  // Options for hours (0 to 7) and minutes (0 to 58)
  const hourOptions = Array.from({ length: 8 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 59 }, (_, i) => i);

  // Display logic for the selected duration
  const displayValue = `${hours ? `${hours}h` : ""} ${
    minutes ? `${minutes}min` : ""
  }`.trim();

  // Close the dropdown if a click occurs outside of the selector area
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the selectorRef
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside); // Add event listener on mount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
    };
  }, [selectorRef]);

  return (
    <div ref={selectorRef} className="relative">
      {/* Custom CSS for hiding the scrollbar */}
      <style>
        {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none; /* Hides the scrollbar in WebKit browsers */
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* For IE and Edge */
                    scrollbar-width: none;  /* For Firefox */
                }
                `}
      </style>
      <div
        className={`cursor-pointer p-2 border border-gray-300 rounded-md shadow-sm flex justify-between items-center ${
          isOpen ? "bg-gray-100" : "bg-white"
        }`}
        onClick={() => setIsOpen(!isOpen)} // Toggle the dropdown open/close
      >
        {/* Display the selected value or default message */}
        {displayValue || "Select duration"}
        {/* Toggle icon based on whether the dropdown is open or closed */}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* Dropdown menu to select hours and minutes */}
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <div className="flex">
            {/* Hours selector */}
            <div className="w-32">
              <div className="sticky top-0 bg-white">
                {/* Label for hours */}
                <label className="block text-sm font-medium text-gray-700 p-2">
                  Hours
                </label>
              </div>
              <div className="h-40 overflow-y-auto hide-scrollbar">
                {/* Map through hourOptions and render them */}
                {hourOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => setHours(option)} // Update hours when an option is selected
                    className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${
                      option === hours ? "bg-brand-200" : ""
                    }`}
                  >
                    {option} {/* Display the hour option */}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes selector */}
            <div className="w-32">
              <div className="sticky top-0 bg-white">
                {/* Label for minutes */}
                <label className="block text-sm font-medium text-gray-700 p-2">
                  Minutes
                </label>
              </div>
              <div className="h-40 overflow-y-auto hide-scrollbar">
                {/* Map through minuteOptions and render them */}
                {minuteOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => setMinutes(option)} // Update minutes when an option is selected
                    className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${
                      option === minutes ? "bg-brand-200" : ""
                    }`}
                  >
                    {option} {/* Display the minute option */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CombinedDurationSelector;
