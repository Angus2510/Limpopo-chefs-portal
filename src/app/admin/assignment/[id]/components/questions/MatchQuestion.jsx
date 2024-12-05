import React from 'react';

const MatchQuestion = ({ options, setOptions }) => {
    const handleAddPair = () => {
        const newPair = { columnA: '', columnB: '' };
        setOptions([...options, newPair]);
    };

    const handlePairChange = (index, key, value) => {
        const newOptions = options.map((option, i) => (
            i === index ? { ...option, [key]: value } : option
        ));
        setOptions(newOptions);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
            {options.map((option, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                    <input
                        type="text"
                        value={option.columnA}
                        onChange={(e) => handlePairChange(index, 'columnA', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                        placeholder="Enter Column A text"
                    />
                    <input
                        type="text"
                        value={option.columnB}
                        onChange={(e) => handlePairChange(index, 'columnB', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter Column B text"
                    />
                </div>
            ))}
            <button onClick={handleAddPair} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                Add Pair
            </button>
        </div>
    );
};

export default MatchQuestion;
