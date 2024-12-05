"use client"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useGetEventsQuery, useDeleteEventMutation } from '@/lib/features/event/evntsApiSlice';
import Modal from './Modal';
import CreateEventModal from './CreateEventModal';
import '../../../../styles/FullCalendarStyles.css';

const Timesheet = (id) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteEvent] = useDeleteEventMutation();

  const { data: fetchedEvents, error, isLoading } = useGetEventsQuery();

  useEffect(() => {
    if (fetchedEvents) {
      const coloredEvents = fetchedEvents.map(event => ({
        ...event,
        backgroundColor: event.color || '#3788d8', 
        borderColor: event.color || '#3788d8', 
      }));
      setEvents(coloredEvents);
    }
  }, [fetchedEvents]);

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
    setIsCreateModalOpen(false);
  };

  const handleEventClick = (clickInfo) => {
    console.log('Selected Event:', clickInfo.event);
    setSelectedEvent(clickInfo.event);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const openCreateModal = () => {
    setSelectedEvent(null); // Ensure it's cleared for new event creation
    setIsCreateModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id).unwrap();
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        closeModal();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const getWeekOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000));
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const renderWeekNumber = (date) => {
    const weekNumber = getWeekOfYear(date);
    return `Week ${weekNumber}`;
  };

  const handleDatesSet = (arg) => {
    const titleElement = document.querySelector('.fc-toolbar-title');
    if (titleElement) {
      // Clear existing week number
      titleElement.querySelectorAll('.week-number').forEach(el => el.remove());

      // Add new week number if not in month view
      if (arg.view.type !== 'dayGridMonth') {
        const weekNumberDiv = document.createElement('div');
        weekNumberDiv.className = 'week-number';
        weekNumberDiv.style.fontSize = '0.8em';
        weekNumberDiv.style.fontWeight = 'normal';
        weekNumberDiv.textContent = renderWeekNumber(arg.view.currentStart);
        titleElement.appendChild(weekNumberDiv);
      }
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-content">
        <span className="color-indicator" style={{ backgroundColor: eventInfo.event.backgroundColor }}></span>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  const renderDetailedEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        <div><small>Details: {eventInfo.event.extendedProps.details}</small></div>
        <div><small>Location: {Array.isArray(eventInfo.event.extendedProps.location) ? eventInfo.event.extendedProps.location.map(loc => loc.title).join(', ') : eventInfo.event.extendedProps.location}</small></div>
        <div><small>Assigned To: {Array.isArray(eventInfo.event.extendedProps.assignedTo) ? eventInfo.event.extendedProps.assignedTo.map(assignee => assignee.title).join(', ') : eventInfo.event.extendedProps.assignedTo}</small></div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <button onClick={openCreateModal} className="mb-4 bg-green-500 text-white py-2 px-4 rounded">
        Create Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="listWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        views={{
          listDay: { buttonText: 'Day' },
          listWeek: { buttonText: 'Current Roster' },
          listMonth: { buttonText: 'Month' },
          timeGridWeek: { buttonText: 'Week' },
        }}
        weekNumbers={true}
        firstDay={1} 
        events={events}
        editable={true}
        selectable={true}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventContent={(eventInfo) => {
          if (eventInfo.view.type === 'listWeek') {
            return renderDetailedEventContent(eventInfo);
          }
          return renderEventContent(eventInfo);
        }} // Custom event content
      />

      <Modal show={isModalOpen} onClose={closeModal} onDelete={handleDelete}>
        {selectedEvent && (
          <div className="event-details">
            <h4>Event Details</h4>
            <p><strong>Title:</strong> {selectedEvent.title}</p>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Details:</strong> {selectedEvent.extendedProps.details}</p>
            <p><strong>Location:</strong> {Array.isArray(selectedEvent.extendedProps.location) ? selectedEvent.extendedProps.location.map(loc => loc.title).join(', ') : selectedEvent.extendedProps.location}</p>
            <p><strong>Assigned To:</strong> {Array.isArray(selectedEvent.extendedProps.assignedTo) ? selectedEvent.extendedProps.assignedTo.map(assignee => assignee.title).join(', ') : selectedEvent.extendedProps.assignedTo}</p>
          </div>
        )}
      </Modal>

      <CreateEventModal
        show={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        eventToEdit={selectedEvent}
      />
    </div>
  );
};

export default Timesheet;
