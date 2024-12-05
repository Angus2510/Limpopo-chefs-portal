'client'
import React from 'react';

const EventPopup = ({ event, onDelete, onEdit, onClose }) => {
  const handleDelete = () => {
    onDelete(event);
    onClose();
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-5 rounded-lg shadow-lg'>
        <h3 className='text-lg font-bold'>{event.title}</h3>
        <p className='text-sm'>Time: {event.timeFrom}</p>
        <p className='text-sm'>Assigned to: {event.assignedTo}</p>
        <div className='flex justify-end space-x-2'>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
          <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
