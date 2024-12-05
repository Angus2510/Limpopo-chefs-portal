import React, { useState, useEffect } from 'react';

const MatchQuestion = ({ options, setOptions }) => {
    const [typeA, setTypeA] = useState('text');
    const [typeB, setTypeB] = useState('text');
    const [imagePreviews, setImagePreviews] = useState({});

    useEffect(() => {
        options.forEach((option, index) => {
            if (option.typeA === 'image' && option.columnA instanceof File) {
                createPreview(option.columnA, `${index}A`);
            }
            if (option.typeB === 'image' && option.columnB instanceof File) {
                createPreview(option.columnB, `${index}B`);
            }
        });
    }, [options]);

    const createPreview = (file, key) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreviews(prev => ({
                ...prev,
                [key]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddPair = (e) => {
        e.preventDefault();
        const newPair = { columnA: '', columnB: '', typeA, typeB };
        setOptions([...options, newPair]);
    };

    const handleTypeAChange = (e) => {
        setTypeA(e.target.value);
    };

    const handleTypeBChange = (e) => {
        setTypeB(e.target.value);
    };

    const handlePairChange = (index, key, value) => {
        if (key === 'columnA' || key === 'columnB') {
            if (value instanceof File) {
                createPreview(value, `${index}${key}`);
            }
        }

        const newOptions = options.map((option, i) => (
            i === index ? { ...option, [key]: value } : option
        ));
        setOptions(newOptions);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
            <div className="flex justify-between mb-2">
                <select
                    value={typeA}
                    onChange={handleTypeAChange}
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                </select>
                <select
                    value={typeB}
                    onChange={handleTypeBChange}
                    className="p-2 border border-gray-300 rounded-lg"
                >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                </select>
            </div>
            {options.map((option, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                    {typeA === 'text' ? (
                        <input
                            type="text"
                            value={option.columnA}
                            onChange={(e) => handlePairChange(index, 'columnA', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                            placeholder="Enter Column A text"
                        />
                    ) : (
                        <>
                            <input
                                type="file"
                                onChange={(e) => handlePairChange(index, 'columnA', e.target.files[0])}
                                className="p-2 border border-gray-300 rounded-lg mr-2"
                            />
                            {imagePreviews[`${index}columnA`] && (
                                <img
                                    src={imagePreviews[`${index}columnA`]}
                                    alt="Column A Preview"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                        </>
                    )}
                    {typeB === 'text' ? (
                        <input
                            type="text"
                            value={option.columnB}
                            onChange={(e) => handlePairChange(index, 'columnB', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter Column B text"
                        />
                    ) : (
                        <>
                            <input
                                type="file"
                                onChange={(e) => handlePairChange(index, 'columnB', e.target.files[0])}
                                className="p-2 border border-gray-300 rounded-lg"
                            />
                            {imagePreviews[`${index}columnB`] && (
                                <img
                                    src={imagePreviews[`${index}columnB`]}
                                    alt="Column B Preview"
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                        </>
                    )}
                </div>
            ))}
            <button onClick={handleAddPair} className="bg-brand-500 text-white px-4 py-2 rounded mt-2">
                Add Pair
            </button>
        </div>
    );
};

export default MatchQuestion;