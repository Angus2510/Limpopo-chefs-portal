import React, { useState, useEffect } from 'react';
import { useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '@/lib/features/event/evntsApiSlice';
import CampusSelect from '@/components/select/CampusSelect';
import IntakeGroupSelect from '@/components/select/IntakeGroupSelect';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const CreateEventModal = ({ show, onClose, onSave, eventToEdit = null }) => {
  const [event, setEvent] = useState({ title: '', startDate: '', details: '', allDay: false });
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [selectedIntakeGroups, setSelectedIntakeGroups] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    if (eventToEdit) {
      console.log('Event to Edit:', eventToEdit);

      const startDate = new Date(eventToEdit.extendedProps.startDate);
      const formattedStartDate = eventToEdit.allDay
        ? startDate.toISOString().slice(0, 10) // YYYY-MM-DD for date input
        : new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16); // Convert to local datetime

      setEvent({
        title: eventToEdit.title,
        startDate: formattedStartDate,
        details: eventToEdit.extendedProps.details,
        allDay: eventToEdit.allDay,
      });
      setSelectedCampuses(eventToEdit.extendedProps.location.map(loc => loc._id) || []);
      setSelectedIntakeGroups(eventToEdit.extendedProps.assignedTo.map(assignee => assignee._id) || []);
      setSelectedColor(eventToEdit.backgroundColor || '');
    } else {
      setEvent({ title: '', startDate: '', details: '', allDay: false });
      setSelectedCampuses([]);
      setSelectedIntakeGroups([]);
      setSelectedColor('');
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    console.log('Event to Save:', event);
    console.log('Selected Campuses:', selectedCampuses);
    console.log('Selected Intake Groups:', selectedIntakeGroups);

    try {
      const startDate = event.allDay ? new Date(event.startDate).toISOString().slice(0, 10) : new Date(event.startDate).toISOString();

      const newEvent = {
        ...event,
        startDate: startDate,
        location: selectedCampuses,
        assignedTo: selectedIntakeGroups,
        assignedToModel: 'IntakeGroup',
        createdBy: '6644553cbea19b3041625baa',
        color: selectedColor,
      };

      if (eventToEdit) {
        const updatedEvent = await updateEvent({ id: eventToEdit.id, ...newEvent }).unwrap();
        onSave(updatedEvent);
      } else {
        const savedEvent = await createEvent(newEvent).unwrap();
        onSave(savedEvent);
      }

      setEvent({ title: '', startDate: '', details: '', allDay: false });
      setSelectedCampuses([]);
      setSelectedIntakeGroups([]);
      setSelectedColor('');
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDelete = async () => {
    if (eventToEdit) {
      try {
        await deleteEvent(eventToEdit.id).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsColorDropdownOpen(false);
  };

  if (!show) {
    return null;
  }

  const colors = [
    { label: 'Blue', value: '#0FBFF6' },
    { label: 'Red', value: '#FF3A3A' },
    { label: 'Yellow', value: '#FFE500' },
    { label: 'Grey', value: '#D4D4D4' },
    { label: 'Purple', value: '#E660F2' },
    { label: 'White', value: '#FFFFFF' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal bg-white dark:bg-dmgray-900">
        <button className="modal-close text-gray-700 dark:text-white" onClick={onClose}>
          <FiX />
        </button>
        <div className="modal-content">
          <h4 className="text-navy-700 dark:text-white">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h4>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Full Day Event</label>
          <div className="mb-4">
            <input type="checkbox" name="allDay" checked={event.allDay} onChange={handleChange} className="left-aligned-checkbox" />
          </div>

          <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Start Date</label>
          <input
           type={event.allDay ? "date" : "datetime-local"} 
           name="startDate" placeholder="Start" 
           value={event.startDate}
           onChange={handleChange}
           className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6" />
          
          <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Title</label>
          <input
           className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6"
          type="text" 
          name="title" 
          placeholder="Title" 
          value={event.title} onChange={handleChange} />
          
          <CampusSelect selectedCampuses={selectedCampuses} setSelectedCampuses={setSelectedCampuses} />
          <IntakeGroupSelect selectedIntakeGroups={selectedIntakeGroups} setSelectedIntakeGroups={setSelectedIntakeGroups} />

          <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Select Color</label>
          <div className="relative w-full">
            <div className="flex items-center gap-2 p-2 border border-gray-300 dark:border-dmgray-700 rounded-md bg-white dark:bg-dmgray-900 shadow-sm cursor-pointer" onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}>
              {selectedColor ? (
                <div className="flex items-center">
                  <span className="color-circle" style={{ backgroundColor: selectedColor }}></span>
                  <span className="text-gray-700 dark:text-dmgray-200">{colors.find((color) => color.value === selectedColor)?.label}</span>
                </div>
              ) : (
                <span className="text-gray-700 dark:text-dmgray-200">Select Color</span>
              )}
              {isColorDropdownOpen ? <FiChevronUp className="ml-auto text-gray-700 dark:text-dmgray-200" /> : <FiChevronDown className="ml-auto text-gray-700 dark:text-dmgray-200" />}
            </div>
            {isColorDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-gray-300 dark:border-dmgray-700 rounded-md bg-white dark:bg-dmgray-900 shadow-lg">
                {colors.map((color) => (
                  <li key={color.value} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-dmgray-700 cursor-pointer" onClick={() => handleColorSelect(color.value)}>
                    <span className="color-circle" style={{ backgroundColor: color.value }}></span>
                    <span className="ml-2 text-gray-700 dark:text-dmgray-200">{color.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-dmgray-200 mb-1">Details</label>
          <textarea 
          name="details" 
          placeholder="Details" 
          value={event.details} 
          onChange={handleChange}
           className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white  dark:bg-dmgray-900  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dmgray-700 placeholder:text-gray-400 dark:placeholder-dmgray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:focus:ring-dmgray-400 sm:text-sm sm:leading-6"
          ></textarea>
          
          <button onClick={handleSave} disabled={isCreating || isUpdating} className="mt-4 w-full rounded-md bg-green-500 text-white py-2 px-4 hover:bg-green-600">
            {isCreating || isUpdating ? 'Saving...' : eventToEdit ? 'Save Event' : 'Add Event'}
          </button>
          {eventToEdit && (
            <button onClick={handleDelete} className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Delete Event
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 500px;
          width: 100%;
          position: relative;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
        }
        .modal-content {
          margin-top: 20px;
        }
        .color-circle {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .left-aligned-checkbox {
          margin-left: 0;
        }
      `}</style>
    </div>
  );
};

export default CreateEventModal;
