"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetOutcomesQuery } from '@/lib/features/outcome/outcomeApiSlice';

function OutcomeSelect({ selectedOutcome, setSelectedOutcome }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: outcomesData, isFetching, isError, error } = useGetOutcomesQuery();
  const dropdownRef = useRef(null);

  const outcomes = outcomesData ? Object.values(outcomesData.entities) : [];

  const handleOutcomeSelection = (outcomeId) => {
    setSelectedOutcome(outcomeId);
    setIsOpen(false); // Close dropdown on selection
  };

  const filteredOutcomes = outcomes.filter(outcome => {
    const searchLower = searchTerm.toLowerCase();
    return outcome.title.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isFetching) return <p>Loading outcomes...</p>;
  if (isError) return <p>Error loading outcomes: {error?.message}</p>;

  const selectedOutcomeTitle = outcomes.find(outcome => outcome.id === selectedOutcome)?.title || 'Select an outcome';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Outcome *</label>
      <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
        <span className="text-gray-700">{selectedOutcomeTitle}</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto focus:outline-none"
        >
          {isOpen ? <FiChevronUp className="inline-block text-gray-700" /> : <FiChevronDown className="inline-block text-gray-700" />}
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search outcomes..."
            className="w-full p-2 border-b border-gray-300"
          />
          <ul className="max-h-60 overflow-auto">
            {filteredOutcomes.map(outcome => (
              <li key={outcome.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOutcomeSelection(outcome.id)}>
                <input
                  type="radio"
                  checked={selectedOutcome === outcome.id}
                  onChange={() => {}}
                  className="mr-2"
                  readOnly
                />
                {outcome.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OutcomeSelect;
