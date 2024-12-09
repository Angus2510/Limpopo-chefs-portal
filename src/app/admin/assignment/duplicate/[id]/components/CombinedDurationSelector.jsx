import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function CombinedDurationSelector({ hours, setHours, minutes, setMinutes }) {
  // State to manage whether the duration selector dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Reference for the selector element to manage clicks outside of it
  const selectorRef = useRef(null);

  // Options for hours (0-7) and minutes (0-58)
  const hourOptions = Array.from({ length: 8 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 59 }, (_, i) => i);

  // Display logic to show the selected duration in "hours" and "minutes"
  const displayValue = `${hours ? `${hours}h` : ""} ${
    minutes ? `${minutes}min` : ""
  }`.trim();

  // Handle clicks outside the duration selector to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside); // Event listener for clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup the event listener
    };
  }, [selectorRef]);

  return (
    <div ref={selectorRef} className="relative">
      {/* Inline style to hide the scrollbar in the options list */}
      <style>
        {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;  /* Hides the scrollbar in WebKit browsers */
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                `}
      </style>

      {/* Button to toggle the visibility of the dropdown */}
      <div
        className={`cursor-pointer p-2 border border-gray-300 rounded-md shadow-sm flex justify-between items-center ${
          isOpen ? "bg-gray-100" : "bg-white"
        }`}
        onClick={() => setIsOpen(!isOpen)} // Toggle the dropdown open/close
      >
        {displayValue || "Select duration"}{" "}
        {/* Show selected duration or default text */}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}{" "}
        {/* Toggle the icon based on open/close state */}
      </div>

      {/* Dropdown menu containing the hours and minutes options */}
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <div className="flex">
            {/* Hours selector */}
            <div className="w-32">
              <div className="sticky top-0 bg-white">
                <label className="block text-sm font-medium text-gray-700 p-2">
                  Hours
                </label>
              </div>
              <div className="h-40 overflow-y-auto hide-scrollbar">
                {hourOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => setHours(option)} // Set the selected hour when clicked
                    className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${
                      option === hours ? "bg-brand-200" : ""
                    }`} // Highlight selected hour
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes selector */}
            <div className="w-32">
              <div className="sticky top-0 bg-white">
                <label className="block text-sm font-medium text-gray-700 p-2">
                  Minutes
                </label>
              </div>
              <div className="h-40 overflow-y-auto hide-scrollbar">
                {minuteOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => setMinutes(option)} // Set the selected minute when clicked
                    className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${
                      option === minutes ? "bg-brand-200" : ""
                    }`} // Highlight selected minute
                  >
                    {option}
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
