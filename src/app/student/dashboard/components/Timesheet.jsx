'use client';

import React, { useState, useEffect } from 'react';
import { format, addDays, addWeeks, subWeeks, startOfWeek, endOfWeek, isSameWeek, getISOWeek } from 'date-fns';
import { useGetStudentEventsQuery } from '@/lib/features/event/studentEventsApiSlice';

const Timesheet = ({ studentId }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [maxWeekStart] = useState(addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1));
  const [filteredEvents, setFilteredEvents] = useState([]);

  const { data: fetchedEvents = [], isLoading, isError, error } = useGetStudentEventsQuery(studentId);

  console.log(fetchedEvents);
  useEffect(() => {
    const start = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekDays = getDaysOfWeek(start);

    const updatedEvents = weekDays.map(day => {
      const matchingEvents = fetchedEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        console.log("Event start date:", event.startDate, "Parsed date:", eventDate);
        if (isNaN(eventDate)) {
          console.error("Invalid date value:", event.startDate);
          return false;
        }
        return format(eventDate, 'dd MMM yyyy') === day.date;
      });
      if (matchingEvents.length > 0) {
        return {
          ...day,
          events: matchingEvents,
        };
      }
      return day;
    });

    setFilteredEvents(updatedEvents);
  }, [currentWeekStart, fetchedEvents]);

  const getDaysOfWeek = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const dayName = format(date, 'EEEE');
      days.push({
        day: dayName,
        date: format(date, 'dd MMM yyyy'),
        events: [],
      });
    }
    return days;
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const isNextWeekDisabled = isSameWeek(currentWeekStart, maxWeekStart, { weekStartsOn: 1 });

  const getWeekOfYear = (date) => {
    return getISOWeek(date);
  };

  const renderEventContent = (event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const locationTitles = event.location.map(location => location.title).join(', ');
    
    if (isNaN(startDate) || isNaN(endDate)) {
      console.error("Invalid date value:", event.start, event.end);
      return (
        <div className='mb-2 p-2 rounded-md' style={{ backgroundColor: event.color }}>
          <p className='text-lg font-bold'>{event.title}</p>
          <p className='text-sm'>Location: {locationTitles}</p>
          <p className='text-sm'>Details: {event.details}</p>
        </div>
      );
    }

    return (
      <div className='mb-2 p-2 rounded-md' style={{ backgroundColor: event.color }}>
        <time className='text-sm font-medium'>{format(startDate, 'HH:mm')}</time>
        <p className='text-lg font-bold'>{event.title}</p>
        <p className='text-sm'>Location: {locationTitles}</p>
        <p className='text-sm'>Details: {event.details}</p>
      </div>
    );
  };

  return (
    <div className='container mx-auto my-6 p-5 bg-white shadow-lg'>
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='text-center mb-4 md:mb-0'>
          <h1 className='text-3xl font-bold'>
            {format(currentWeekStart, 'dd MMM yyyy')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy')}
          </h1>
          <p className='text-lg text-gray-500'>Week {getWeekOfYear(currentWeekStart)}</p>
        </div>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
          <button
            className='bg-green-500 text-white py-2 px-4 rounded'
            onClick={handlePrevWeek}
          >
            Previous Week
          </button>
          <button
            className='bg-green-500 text-white py-2 px-4 rounded'
            onClick={handleCurrentWeek}
          >
            Current Week
          </button>
          <button
            className={`bg-green-500 text-white py-2 px-4 rounded ${isNextWeekDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextWeek}
            disabled={isNextWeekDisabled}
          >
            Next Week
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Loading events...</p>
      ) : isError ? (
        <p>Error loading events: {error.message}</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8'>
          {filteredEvents.map((day, idx) => (
            (day.events.length > 0 || (day.day !== 'Saturday' && day.day !== 'Sunday')) && (
              <div key={idx} className='flex flex-col mb-4 md:mb-0 bg-gray-100 p-4 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-3'>{day.day}, {day.date}</h2>
                {day.events.length > 0 ? (
                  day.events.map((event, eventIdx) => (
                    <div key={eventIdx}>
                      {renderEventContent(event)}
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-gray-500'>No events</p>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Timesheet;
