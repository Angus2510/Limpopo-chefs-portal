
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function CombinedDurationSelector({ hours, setHours, minutes, setMinutes }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectorRef = useRef(null);

    // Options for hours and minutes
    const hourOptions = Array.from({ length: 8 }, (_, i) => i );  
    const minuteOptions = Array.from({ length: 59 }, (_, i) => i ); 

    // Display logic for the selector
    const displayValue = `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}min` : ''}`.trim();

    // Handle clicks outside the selector to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (selectorRef.current && !selectorRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectorRef]);

    return (
        <div ref={selectorRef} className="relative">
            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                `}
            </style>
            <div
                className={`cursor-pointer p-2 border border-gray-300 rounded-md shadow-sm flex justify-between items-center ${isOpen ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {displayValue || 'Select duration'}
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isOpen && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    <div className="flex">
                        <div className="w-32">
                            <div className="sticky top-0 bg-white">
                                <label className="block text-sm font-medium text-gray-700 p-2">Hours</label>
                            </div>
                            <div className="h-40 overflow-y-auto hide-scrollbar">
                                {hourOptions.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => setHours(option)}
                                        className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${option === hours ? 'bg-green-200' : ''}`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-32">
                            <div className="sticky top-0 bg-white">
                                <label className="block text-sm font-medium text-gray-700 p-2">Minutes</label>
                            </div>
                            <div className="h-40 overflow-y-auto hide-scrollbar">
                                {minuteOptions.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => setMinutes(option)}
                                        className={`cursor-pointer hover:bg-gray-100 p-1 text-center ${option === minutes ? 'bg-green-200' : ''}`}
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
