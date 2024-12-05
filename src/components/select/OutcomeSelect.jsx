"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetOutcomesQuery } from '@/lib/features/outcome/outcomeApiSlice';

function OutcomeSelect({ selectedOutcomes, setSelectedOutcomes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: outcomesData, isFetching, isError, error } = useGetOutcomesQuery();
  const dropdownRef = useRef(null);

  const outcomes = outcomesData ? Object.values(outcomesData.entities) : [];

  const toggleOutcomeSelection = (outcomeId) => {
    setSelectedOutcomes(prevSelected => {
      return prevSelected.includes(outcomeId)
        ? prevSelected.filter(id => id !== outcomeId)
        : [...prevSelected, outcomeId];
    });
  };

  const removeOutcomeSelection = (outcomeId) => {
    setSelectedOutcomes(prevSelected => prevSelected.filter(id => id !== outcomeId));
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes</label>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm">
        {selectedOutcomes.map(outcomeId => {
          const outcome = outcomesData?.entities[outcomeId];
          return (
            <div key={outcome.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-gray-700">{outcome.title}</span>
              <FiX className="cursor-pointer text-gray-700" onClick={() => removeOutcomeSelection(outcome.id)} />
            </div>
          );
        })}
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
                  onClick={() => toggleOutcomeSelection(outcome.id)}>
                <input
                  type="checkbox"
                  checked={selectedOutcomes.includes(outcome.id)}
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
