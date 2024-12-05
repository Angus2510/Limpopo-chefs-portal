import React, { useState, useEffect, useRef } from 'react';

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, itemTitle }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(''); // Clear input value when popup opens
      if (inputRef.current) {
        inputRef.current.focus(); // Focus the input field
      }
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (inputValue === 'delete') {
      onConfirm();
      setInputValue('');
    } else {
      alert('Please type "delete" to confirm.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">
          Please type <strong>delete</strong> to confirm deletion of <strong>{itemTitle}</strong>.
        </p>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
