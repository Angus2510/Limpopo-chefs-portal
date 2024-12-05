'use client'
import React, { useState } from 'react';
import EventPopup from './EventPopup';

const Timesheet = () => {
  const [events, setEvents] = useState([
    { day: 'Monday', date: '20 May 2024', events: [{ id: 1, timeFrom: '10:00', timeTo: '11:00', title: 'Intro to Nutrition and Healthy Eating', description: 'Class about nutrition', assignedTo: 'Group A', color: '#aec6cf' }] },
    { day: 'Tuesday', date: '21 May 2024', events: [{ id: 2, timeFrom: '09:00', timeTo: '10:00', title: 'Food Chemistry',description: 'Class about food chemistry', assignedTo: 'Dr. Emily', color: '#FDFD96' }] },
    { day: 'Wednesday', date: '22 May 2024', events: [{ id: 3, timeFrom: '11:00', timeTo: '12:00', title: 'World Cuisines',description: 'Class about world Cuisine', assignedTo: 'Group B', color: '#FDFD96' }] },
    { day: 'Thursday', date: '23 May 2024', events: [{ id: 4, timeFrom: '10:00', timeTo: '12:00', title: 'Sustainable Cooking Practices',description: 'Class about sustainable cooking', assignedTo: 'Mr. Adams', color: '#ff6961' }] },
    { day: 'Friday', date: '24 May 2024', events: [{ id: 5, timeFrom: '09:00', timeTo: '10:30', title: 'Nutritional Science',description: 'Class about nutritional science', assignedTo: 'Group C', color: '#FDFD96' }] },
    { day: 'Saturday', date: '25 May 2024', events: [{ id: 6, timeFrom: '10:00', timeTo: '11:00', title: 'Restaurant Management',description: 'Test about restaurant management', assignedTo: 'Prof. John', color: '#FDFD96' }] },
    { day: 'Sunday', date: '26 May 2024', events: [] }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ day: '', timeFrom: '', timeTo: '', title: '', assignedTo: '', color: 'red' });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const intakeGroups = ['Intake Group A', 'Intake Group B', 'Intake Group C'];
  const lecturers = ['Dr. Emily', 'Prof. John', 'Mr. Adams'];

  const handleAddEvent = () => {
    if (newEvent.day && newEvent.timeFrom && newEvent.timeTo && newEvent.title && newEvent.assignedTo && newEvent.color) {
      const updatedEvents = events.map(day => day.day === newEvent.day ? {
        ...day,
        events: [...day.events, { 
          id: Math.random(), 
          timeFrom: newEvent.timeFrom, 
          timeTo: newEvent.timeTo, 
          title: newEvent.title, 
          description: newEvent.description, 
          assignedTo: newEvent.assignedTo, 
          color: newEvent.color 
        }]
      } : day);
      setEvents(updatedEvents);
      setIsModalOpen(false);
      setNewEvent({ day: '', timeFrom: '', timeTo: '', title: '', description: '', assignedTo: '', color: 'red' });
    } else {
      alert('Please fill out all fields.');
    }
  };


  const handleDeleteEvent = (event) => {
    const updatedEvents = events.map(day => ({
      ...day,
      events: day.events.filter(e => e.id !== event.id)
    }));
    setEvents(updatedEvents);
  };

  const handleEditEvent = (editedEvent) => {
    const updatedEvents = events.map(day => ({
      ...day,
      events: day.events.map(event => event.id === editedEvent.id ? editedEvent : event)
    }));
    setEvents(updatedEvents);
    setIsModalOpen(false);
  };

  const handleColorChange = (event, eventId) => {
    const { value } = event.target;
    const updatedEvents = events.map(day => ({
      ...day,
      events: day.events.map(event => event.id === eventId ? { ...event, color: value } : event)
    }));
    setEvents(updatedEvents);
  };

  const filteredEvents = events.filter(day => (day.events.length > 0 || day.day !== 'Saturday' && day.day !== 'Sunday'));

  return (
    <div className='container mx-auto my-6 p-5 bg-white shadow-lg'>
      <h1 className='text-3xl font-bold text-center'>Week 20</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8'>
        {filteredEvents.map((day, idx) => (
          <div key={idx} className='flex flex-col mb-4 md:mb-0 bg-gray-100 p-4 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-3'>{day.day}, {day.date}</h2>
            {day.events.map((event, eventIdx) => (
              <div key={eventIdx} className='mb-2 p-2 rounded-md' style={{ backgroundColor: event.color }} onClick={() => setSelectedEvent(event)}>
                <time className='text-sm font-medium'>{event.timeFrom} - {event.timeTo}</time>
                <p className='text-lg font-bold'>{event.title}</p>
                <p className='text-lg'>{event.description}</p>
                <p className='text-sm'>Assigned to: {event.assignedTo}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Event
      </button>
     {isModalOpen && (
  <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
    <div className='bg-white p-5 rounded-lg shadow-lg'>
      <h3 className='text-lg font-bold'>New Event</h3>
      <select
        value={newEvent.day}
        onChange={(e) => setNewEvent({...newEvent, day: e.target.value})}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Day</option>
        {events.map((day, index) => (
          <option key={index} value={day.day}>{day.day}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Event Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Event Description" 
        value={newEvent.description}
        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
        className="w-full p-2 border rounded mb-2"
      />
      <div className='grid grid-cols-2 gap-2'>
        <input
          type="time"
          placeholder="Time From"
          value={newEvent.timeFrom}
          onChange={(e) => setNewEvent({...newEvent, timeFrom: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="time"
          placeholder="Time To"
          value={newEvent.timeTo}
          onChange={(e) => setNewEvent({...newEvent, timeTo: e.target.value})}
          className="w-full p-2 border rounded mb-2"
        />
      </div>

<select
  value={newEvent.assignedTo}
  onChange={(e) => {
    const value = e.target.value;
    if (value === 'all') {
      setNewEvent({ ...newEvent, assignedTo: 'All', specificAssignment: '' });
    } else {
      setNewEvent({ ...newEvent, assignedTo: value });
    }
  }}
  className="w-full p-2 border rounded mb-2"
>
  <option value="">Add guests</option>
  <option value="all">All</option>
  <option value="intakeGroup">Intake Group</option>
  <option value="personal">Personal</option>
</select>
{(newEvent.assignedTo === 'intakeGroup') && (
  <select
    value={newEvent.specificAssignment}
    onChange={(e) => setNewEvent({...newEvent, specificAssignment: e.target.value})}
    className="w-full p-2 border rounded mb-2"
  >
    <option value="">Select {newEvent.assignedTo === 'intakeGroup' ? 'Group' : 'Lecturer'}</option>
    {(newEvent.assignedTo === 'intakeGroup' ? intakeGroups : lecturers).map(item => (
      <option key={item} value={item}>{item}</option>
    ))}
  </select>
)}



      <select
        value={newEvent.color}
        onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="#ff6961">Red</option>
        <option value="FDFD96">Yellow</option>
        <option value="#aec6cf">Blue</option>
        <option value="#77dd77">Green</option>
        <option value="#c0c2c9">Grey</option>
      </select>
      <div className='flex justify-end space-x-2'>
        <button onClick={() => setIsModalOpen(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Cancel
        </button>
        <button onClick={handleAddEvent} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save Event
        </button>
      </div>
    </div>
  </div>
)}

      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Timesheet;