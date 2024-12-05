'use client'
import React, { useState } from 'react';

const Timesheet = () => {
  const [events] = useState([
    { day: 'Monday', date: '06 May 2024', events: [{ id: 1, timeFrom: '10:00', timeTo: '11:00', title: 'Intro to Nutrition and Healthy Eating', assignedTo: 'Group A', color: 'red' }] },
    { day: 'Tuesday', date: '07 May 2024', events: [{ id: 2, timeFrom: '09:00', timeTo: '10:00', title: 'Food Chemistry', assignedTo: 'Dr. Emily', color: 'yellow' }] },
    { day: 'Wednesday', date: '08 May 2024', events: [{ id: 3, timeFrom: '11:00', timeTo: '12:00', title: 'World Cuisines', assignedTo: 'Group B', color: 'blue' }] },
    { day: 'Thursday', date: '09 May 2024', events: [{ id: 4, timeFrom: '10:00', timeTo: '12:00', title: 'Sustainable Cooking Practices', assignedTo: 'Mr. Adams', color: 'red' }] },
    { day: 'Friday', date: '10 May 2024', events: [{ id: 5, timeFrom: '09:00', timeTo: '10:30', title: 'Nutritional Science', assignedTo: 'Group C', color: 'yellow' }] },
    { day: 'Saturday', date: '11 May 2024', events: [{ id: 6, timeFrom: '10:00', timeTo: '11:00', title: 'Restaurant Management', assignedTo: 'Prof. John', color: 'blue' }] },
    { day: 'Sunday', date: '12 May 2024', events: [] }
  ]);

  const filteredEvents = events.filter(day => (day.events.length > 0 || day.day !== 'Saturday' && day.day !== 'Sunday'));

  return (
    <div className='container mx-auto my-6 p-5 bg-white shadow-lg'>
      <h1 className='text-3xl font-bold text-center'>Week 19</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8'>
        {filteredEvents.map((day, idx) => (
          <div key={idx} className='flex flex-col mb-4 md:mb-0 bg-gray-100 p-4 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-3'>{day.day}, {day.date}</h2>
            {day.events.map((event, eventIdx) => (
              <div key={eventIdx} className='mb-2 p-2 rounded-md' style={{ backgroundColor: event.color }}>
                <time className='text-sm font-medium'>{event.timeFrom} - {event.timeTo}</time>
                <p className='text-lg font-bold'>{event.title}</p>
                <p className='text-sm'>Assigned to: {event.assignedTo}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timesheet;
