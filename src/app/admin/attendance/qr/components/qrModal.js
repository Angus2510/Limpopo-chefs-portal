import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg max-w-4xl mx-auto max-w-full max-h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 text-sm"
          aria-label="Close"
        >
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
