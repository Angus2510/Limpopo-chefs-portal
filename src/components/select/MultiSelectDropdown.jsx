import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ filters, onFilterChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionChange = (value) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedOptions);
    }
  }, [selectedOptions, onFilterChange]);

  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index} className="relative inline-block text-left" ref={dropdownRef}>
          <div>
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                {filter.defaultOption}
                {/* <!-- Heroicon name: solid/chevron-down --> */}
                <svg
                  className="-mr-1 ml-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </div>

          {/* <!-- Dropdown panel --> */}
          {isOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                {filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedOptions.includes(option.value)}
                      onChange={() => handleOptionChange(option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiSelectDropdown;
