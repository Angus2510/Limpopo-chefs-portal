import Image from "next/image"; // Import the Image component from Next.js for displaying images
import React, { useState, useEffect } from "react"; // Import React and hooks (useState, useEffect)

const MatchQuestion = ({ options, setOptions }) => {
  // State to track the type of input (text or image) for column A and column B
  const [typeA, setTypeA] = useState("text");
  const [typeB, setTypeB] = useState("text");

  // State to store image previews for files uploaded in columns A and B
  const [imagePreviews, setImagePreviews] = useState({});

  // useEffect hook to handle the creation of image previews when options change
  useEffect(() => {
    // Loop through each option to check if it has an image file in either column A or B
    options.forEach((option, index) => {
      if (option.typeA === "image" && option.columnA instanceof File) {
        createPreview(option.columnA, `${index}A`);
      }
      if (option.typeB === "image" && option.columnB instanceof File) {
        createPreview(option.columnB, `${index}B`);
      }
    });
  }, [options]); // Effect runs whenever the options state changes

  // Function to create a preview of an image file
  const createPreview = (file, key) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [key]: reader.result, // Add the preview URL to the state
      }));
    };
    reader.readAsDataURL(file); // Read the file as a data URL (image)
  };

  // Function to handle adding a new pair (column A and column B)
  const handleAddPair = (e) => {
    e.preventDefault();
    const newPair = { columnA: "", columnB: "", typeA, typeB }; // Create a new pair with empty text or image columns
    setOptions([...options, newPair]); // Add the new pair to the options array
  };

  // Function to handle changes to the type of input for column A (text or image)
  const handleTypeAChange = (e) => {
    setTypeA(e.target.value); // Update the typeA state based on user selection
  };

  // Function to handle changes to the type of input for column B (text or image)
  const handleTypeBChange = (e) => {
    setTypeB(e.target.value); // Update the typeB state based on user selection
  };

  // Function to handle changes in the input fields for column A or column B
  const handlePairChange = (index, key, value) => {
    // If the value is a file, create a preview for it
    if (key === "columnA" || key === "columnB") {
      if (value instanceof File) {
        createPreview(value, `${index}${key}`); // Create preview for the image file
      }
    }

    // Update the options array with the new value for the specific pair
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, [key]: value } : option
    );
    setOptions(newOptions); // Update the options state
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm max-w-md w-full mx-auto">
      {/* Dropdown for selecting the input type for column A (text or image) */}
      <div className="flex justify-between mb-2">
        <select
          value={typeA} // Set the current type of column A
          onChange={handleTypeAChange} // Handle change in type for column A
          className="p-2 border border-gray-300 rounded-lg mr-2"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        {/* Dropdown for selecting the input type for column B (text or image) */}
        <select
          value={typeB} // Set the current type of column B
          onChange={handleTypeBChange} // Handle change in type for column B
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Loop through the options and render input fields or file inputs based on the selected types */}
      {options.map((option, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          {/* If typeA is 'text', render a text input for column A */}
          {typeA === "text" ? (
            <input
              type="text"
              value={option.columnA}
              onChange={(e) =>
                handlePairChange(index, "columnA", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg mr-2"
              placeholder="Enter Column A text"
            />
          ) : (
            <>
              {/* If typeA is 'image', render a file input for column A */}
              <input
                type="file"
                onChange={(e) =>
                  handlePairChange(index, "columnA", e.target.files[0])
                }
                className="p-2 border border-gray-300 rounded-lg mr-2"
              />
              {/* If an image preview exists, display it */}
              {imagePreviews[`${index}columnA`] && (
                <Image
                  src={imagePreviews[`${index}columnA`]}
                  alt="Column A Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </>
          )}

          {/* If typeB is 'text', render a text input for column B */}
          {typeB === "text" ? (
            <input
              type="text"
              value={option.columnB}
              onChange={(e) =>
                handlePairChange(index, "columnB", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Column B text"
            />
          ) : (
            <>
              {/* If typeB is 'image', render a file input for column B */}
              <input
                type="file"
                onChange={(e) =>
                  handlePairChange(index, "columnB", e.target.files[0])
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              {/* If an image preview exists, display it */}
              {imagePreviews[`${index}columnB`] && (
                <Image
                  src={imagePreviews[`${index}columnB`]}
                  alt="Column B Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </>
          )}
        </div>
      ))}
      {/* Button to add a new pair of column inputs */}
      <button
        onClick={handleAddPair}
        className="bg-brand-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Pair
      </button>
    </div>
  );
};

export default MatchQuestion;
