import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Sidebar from '../components/Sidebar'; 
import Alert from '../components/Alert';     
import EventFormModal from '../components/EventFormModal'; // VERIFY THIS PATH

// Ensure 'react-icons' is installed: npm install react-icons
import { FiPlus } from 'react-icons/fi'; // Using FiPlus for the add event button

export default function ProjectCalendarPage() {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const calendarRef = useRef(null);

  const [org, setOrg] = useState(null);
  const [project, setProject] = useState(null);
  const [userOrgRole, setUserOrgRole] = useState(location.state?.userOrgRole || null);
  const [loggedInUserId, setLoggedInUserId] = useState(location.state?.loggedInUserId || null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentEventData, setCurrentEventData] = useState(null);
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view

  const isAdminInOrg = userOrgRole === 'admin';

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config);
      setOrg(orgRes.data.data);

      if (!userOrgRole || !loggedInUserId) {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
        const currentUserIdFromAPI = userRes.data.data._id;
        const orgMembers = orgRes.data.data.members;
        const currentUserMember = orgMembers.find(
          member => member.user && member.user._id === currentUserIdFromAPI
        );
        setUserOrgRole(currentUserMember ? currentUserMember.role : null);
        setLoggedInUserId(currentUserIdFromAPI);
      }

      const projectRes = await axios.get(`http://localhost:5000/api/projects/single/${projectId}`, config);
      setProject(projectRes.data.data);

      const eventsRes = await axios.get(`http://localhost:5000/api/events/projects/${projectId}/events`, config);
      setCalendarEvents(eventsRes.data.data);

    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
      setError(err.response?.data?.error || 'Failed to load calendar.');
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 404) {
        navigate(`/org/${orgId}/projects`);
      }
    } finally {
      setLoading(false);
    }
  }, [orgId, projectId, navigate, userOrgRole, loggedInUserId]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const handleDateClick = (arg) => {
    if (isAdminInOrg) {
      setCurrentEventData({ start: arg.dateStr });
      setIsEditMode(false);
      setIsViewMode(false);
      setShowEventModal(true);
    } else {
      setError('Only admins can create events.');
    }
  };

  const handleEventClick = (arg) => {
    const { event } = arg;
    if (event.extendedProps.type === 'custom') {
        setCurrentEventData(event);
        setIsEditMode(isAdminInOrg);
        setIsViewMode(!isAdminInOrg);
        setShowEventModal(true);
    } else {
        // For non-custom events, display a non-dismissible alert with event details
        // You might want a custom modal here instead of a simple alert
        setError(`This is a ${event.extendedProps.type.toUpperCase()} event:\nTitle: ${event.title}\nStart: ${new Date(event.start).toLocaleString()}\n${event.end ? `End: ${new Date(event.end).toLocaleString()}` : ''}`);
    }
  };

  const handleEventSubmit = async (formData) => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditMode && currentEventData) {
        const res = await axios.put(
          `http://localhost:5000/api/events/${currentEventData.id}`,
          formData,
          config
        );
        setError(res.data.message || 'Event updated successfully!'); // Display success message
      } else {
        const res = await axios.post(
          `http://localhost:5000/api/events/projects/${projectId}/events`,
          formData,
          config
        );
        setError(res.data.message || 'Event created successfully!'); // Display success message
      }
      setShowEventModal(false);
      fetchCalendarData(); // Re-fetch events to update the calendar
    } catch (err) {
      console.error('Error submitting event:', err);
      setError(err.response?.data?.error || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventDelete = async (eventId) => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.delete(
        `http://localhost:5000/api/events/${eventId}`,
        config
      );
      setError(res.data.message || 'Event deleted successfully!'); // Display success message
      setShowEventModal(false);
      fetchCalendarData(); // Re-fetch events to update the calendar
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.error || 'Failed to delete event.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={org} activePage={`project-${projectId}-calendar`} />
        <div className="flex-1 flex justify-center items-center p-8">
          <p className="text-gray-700 text-lg">Loading project calendar...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={org} activePage={`project-${projectId}-calendar`} />
        <div className="flex-1 flex justify-center items-center p-8">
          {error ? <Alert message={error} type="error" /> : <p className="text-gray-700 text-lg">Project not found or accessible.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={org} activePage={`project-${projectId}-calendar`} />
      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full ml-0 md:ml-64">
        {/* Page Header */}
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 inline-block">
          Project Calendar
        </h1>
        <p className="text-lg text-gray-600 mb-8 font-normal max-w-3xl leading-relaxed">
          Manage and view all events for <strong className="text-gray-800">{project.name}</strong>. {project.description}
        </p>

        {/* Alert for messages (error or success) */}
        {error && <Alert message={error} type={error.includes('success') ? 'success' : 'error'} />}

        {/* Top Controls: Add Event Button and View Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          {isAdminInOrg && (
            <button
              onClick={() => {
                setCurrentEventData(null); // Clear previous event data
                setIsEditMode(false);
                setIsViewMode(false);
                setShowEventModal(true);
              }}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                         transition duration-200 ease-in-out inline-flex items-center gap-2 text-base w-full sm:w-auto justify-center"
            >
              <FiPlus className="text-xl" /> Add New Event
            </button>
          )}

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              className={`px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-md cursor-pointer font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-sm ${
                currentView === 'dayGridMonth' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={() => handleViewChange('dayGridMonth')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-md cursor-pointer font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-sm ${
                currentView === 'timeGridWeek' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={() => handleViewChange('timeGridWeek')}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-md cursor-pointer font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-sm ${
                currentView === 'timeGridDay' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={() => handleViewChange('timeGridDay')}
            >
              Day
            </button>
            <button
              className={`px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-md cursor-pointer font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-sm ${
                currentView === 'listWeek' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={() => handleViewChange('listWeek')}
            >
              List
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-[75vh] overflow-hidden border border-gray-200">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={currentView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '' // View buttons are moved outside FullCalendar for custom styling
            }}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={isAdminInOrg}
            eventResizableFromStart={isAdminInOrg}
            eventDurationEditable={isAdminInOrg}
            eventStartEditable={isAdminInOrg}
            eventDrop={(info) => handleEventSubmit({
                id: info.event.id,
                start: info.event.start,
                end: info.event.end,
                allDay: info.event.allDay,
                ...info.event.extendedProps
            })}
            eventResize={(info) => handleEventSubmit({
                id: info.event.id,
                start: info.event.start,
                end: info.event.end,
                allDay: info.event.allDay,
                ...info.event.extendedProps
            })}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            nowIndicator={true}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
              hour12: true
            }}
            // You might need to add custom CSS to style FullCalendar's internal elements
            // (e.g., .fc .fc-toolbar-title, .fc-button, .fc-event, etc.)
            // as Tailwind doesn't directly style third-party library components.
            // Example custom styles in your index.css:
            /*
            .fc-event {
              @apply rounded-md text-white text-sm px-2 py-1;
            }
            .fc-event-custom {
              @apply bg-blue-600;
            }
            .fc-event-past {
              @apply opacity-70;
            }
            .fc-day-header {
              @apply text-gray-700 font-semibold;
            }
            */
            height="100%"
          />
        </div>

        {showEventModal && (
          <EventFormModal
            show={showEventModal}
            onClose={() => setShowEventModal(false)}
            onSubmit={handleEventSubmit}
            eventData={currentEventData}
            isEditMode={isEditMode}
            isViewMode={isViewMode}
            onDelete={handleEventDelete}
          />
        )}
      </div>
    </div>
  );
}
