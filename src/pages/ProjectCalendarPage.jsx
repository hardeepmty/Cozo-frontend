"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import Sidebar from "../components/Sidebar"
import Alert from "../components/Alert"
import EventFormModal from "../components/EventFormModal" // VERIFY THIS PATH

export default function ProjectCalendarPage() {
  const { orgId, projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const calendarRef = useRef(null)

  const [org, setOrg] = useState(null)
  const [project, setProject] = useState(null)
  const [userOrgRole, setUserOrgRole] = useState(location.state?.userOrgRole || null)
  const [loggedInUserId, setLoggedInUserId] = useState(location.state?.loggedInUserId || null)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEventModal, setShowEventModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [currentEventData, setCurrentEventData] = useState(null)
  const [currentView, setCurrentView] = useState("dayGridMonth") // Default view

  const isAdminInOrg = userOrgRole === "admin"

  const fetchCalendarData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config)
      setOrg(orgRes.data.data)

      if (!userOrgRole || !loggedInUserId) {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", config)
        const currentUserIdFromAPI = userRes.data.data._id
        const orgMembers = orgRes.data.data.members
        const currentUserMember = orgMembers.find((member) => member.user && member.user._id === currentUserIdFromAPI)
        setUserOrgRole(currentUserMember ? currentUserMember.role : null)
        setLoggedInUserId(currentUserIdFromAPI)
      }

      const projectRes = await axios.get(`http://localhost:5000/api/projects/single/${projectId}`, config)
      setProject(projectRes.data.data)

      const eventsRes = await axios.get(`http://localhost:5000/api/events/projects/${projectId}/events`, config)
      setCalendarEvents(eventsRes.data.data)
    } catch (err) {
      console.error("Failed to fetch calendar data:", err)
      setError(err.response?.data?.error || "Failed to load calendar.")
      if (err.response?.status === 401) {
        navigate("/login")
      } else if (err.response?.status === 404) {
        navigate(`/org/${orgId}/projects`)
      }
    } finally {
      setLoading(false)
    }
  }, [orgId, projectId, navigate, userOrgRole, loggedInUserId])

  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

  const handleDateClick = (arg) => {
    if (isAdminInOrg) {
      setCurrentEventData({ start: arg.dateStr })
      setIsEditMode(false)
      setIsViewMode(false)
      setShowEventModal(true)
    } else {
      setError("Only admins can create events.")
    }
  }

  const handleEventClick = (arg) => {
    const { event } = arg
    if (event.extendedProps.type === "custom") {
      setCurrentEventData(event)
      setIsEditMode(isAdminInOrg)
      setIsViewMode(!isAdminInOrg)
      setShowEventModal(true)
    } else {
      setError(
        `This is a ${event.extendedProps.type.toUpperCase()} event:\nTitle: ${event.title}\nStart: ${new Date(
          event.start,
        ).toLocaleString()}\n${event.end ? `End: ${new Date(event.end).toLocaleString()}` : ""}`,
      )
    }
  }

  const handleEventSubmit = async (formData) => {
    setLoading(true)
    setError("") // Clear previous errors
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (isEditMode && currentEventData) {
        const res = await axios.put(`http://localhost:5000/api/events/${currentEventData.id}`, formData, config)
        setError(res.data.message || "Event updated successfully!")
      } else {
        const res = await axios.post(`http://localhost:5000/api/events/projects/${projectId}/events`, formData, config)
        setError(res.data.message || "Event created successfully!")
      }
      setShowEventModal(false)
      fetchCalendarData() // Re-fetch events to update the calendar
    } catch (err) {
      console.error("Error submitting event:", err)
      setError(err.response?.data?.error || "Failed to save event.")
    } finally {
      setLoading(false)
    }
  }

  const handleEventDelete = async (eventId) => {
    setLoading(true)
    setError("") // Clear previous errors
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const res = await axios.delete(`http://localhost:5000/api/events/${eventId}`, config)
      setError(res.data.message || "Event deleted successfully!")
      setShowEventModal(false)
      fetchCalendarData() // Re-fetch events to update the calendar
    } catch (err) {
      console.error("Error deleting event:", err)
      setError(err.response?.data?.error || "Failed to delete event.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(view)
    }
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "P"
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} activePage={`project-${projectId}-calendar`} />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-64">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className="w-16 h-16 border-4 border-opacity-30 rounded-full animate-spin"
                style={{ borderColor: "#5a6f3b", borderTopColor: "#3d4b28" }}
              ></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4b28" }}>
                Loading Project Calendar
              </h3>
              <p className="text-gray-600">Fetching events and calendar data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} activePage={`project-${projectId}-calendar`} />
        <div className="flex-1 flex justify-center items-center p-8 ml-0 md:ml-64">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center max-w-md">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d4b28" }}>
              Project Not Found
            </h3>
            {error ? (
              <Alert message={error} type="error" />
            ) : (
              <p className="text-gray-600 text-lg">Project not found or accessible.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
      <Sidebar user={org} activePage={`project-${projectId}-calendar`} />

      <div className="flex-1 ml-0 md:ml-64 p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
            >
              {getInitials(project.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
                ></div>
                <h1
                  className="text-3xl lg:text-4xl font-bold"
                  style={{
                    background: "linear-gradient(to right, #3d4b28, #5a6f3b, #3d4b28)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Project Calendar
                </h1>
              </div>
              <p className="text-gray-600 text-lg ml-4">
                Manage and view all events for <strong className="text-gray-800">{project.name}</strong>.{" "}
                {project.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Events</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                    {calendarEvents.length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">This Month</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#3b82f6" }}>
                    {
                      calendarEvents.filter((event) => {
                        const eventDate = new Date(event.start)
                        const now = new Date()
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
                      }).length
                    }
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Upcoming</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#f59e0b" }}>
                    {
                      calendarEvents.filter((event) => {
                        const eventDate = new Date(event.start)
                        const now = new Date()
                        return eventDate > now
                      }).length
                    }
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#f59e0b" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Your Role</p>
                  <p className="text-lg font-bold mt-1" style={{ color: "#3d4b28" }}>
                    {userOrgRole?.toUpperCase() || "MEMBER"}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert for messages */}
        {error && (
          <Alert
            message={error}
            type={error.includes("success") ? "success" : "error"}
            className="mb-6"
            onClose={() => setError("")}
          />
        )}

        {/* Controls Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Add Event Button */}
            {isAdminInOrg && (
              <button
                onClick={() => {
                  setCurrentEventData(null)
                  setIsEditMode(false)
                  setIsViewMode(false)
                  setShowEventModal(true)
                }}
                className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Event</span>
                </div>
              </button>
            )}

            {/* View Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => handleViewChange("dayGridMonth")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentView === "dayGridMonth"
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
                style={{
                  background:
                    currentView === "dayGridMonth" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                }}
              >
                Month
              </button>
              <button
                onClick={() => handleViewChange("timeGridWeek")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentView === "timeGridWeek"
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
                style={{
                  background:
                    currentView === "timeGridWeek" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                }}
              >
                Week
              </button>
              <button
                onClick={() => handleViewChange("timeGridDay")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentView === "timeGridDay"
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
                style={{
                  background:
                    currentView === "timeGridDay" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                }}
              >
                Day
              </button>
              <button
                onClick={() => handleViewChange("listWeek")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentView === "listWeek"
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
                style={{
                  background: currentView === "listWeek" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                }}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
              ></div>
              <h2 className="text-xl font-bold" style={{ color: "#3d4b28" }}>
                Event Calendar
              </h2>
            </div>

            <div className="h-[75vh] calendar-container">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView={currentView}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                events={calendarEvents}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                editable={isAdminInOrg}
                eventResizableFromStart={isAdminInOrg}
                eventDurationEditable={isAdminInOrg}
                eventStartEditable={isAdminInOrg}
                eventDrop={(info) =>
                  handleEventSubmit({
                    id: info.event.id,
                    start: info.event.start,
                    end: info.event.end,
                    allDay: info.event.allDay,
                    ...info.event.extendedProps,
                  })
                }
                eventResize={(info) =>
                  handleEventSubmit({
                    id: info.event.id,
                    start: info.event.start,
                    end: info.event.end,
                    allDay: info.event.allDay,
                    ...info.event.extendedProps,
                  })
                }
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                nowIndicator={true}
                eventDisplay="block"
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: "short",
                  hour12: true,
                }}
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* Event Modal */}
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

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
        }

        .calendar-container .fc-toolbar-title {
          color: #3d4b28;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .calendar-container .fc-button {
          background: linear-gradient(135deg, #5a6f3b, #3d4b28);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .calendar-container .fc-button:hover {
          background: linear-gradient(135deg, #3d4b28, #5a6f3b);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(90, 111, 59, 0.3);
        }

        .calendar-container .fc-button:disabled {
          background: #e2e8f0;
          color: #64748b;
          transform: none;
          box-shadow: none;
        }

        .calendar-container .fc-event {
          background: linear-gradient(135deg, #5a6f3b, #3d4b28);
          border: none;
          border-radius: 6px;
          padding: 2px 6px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .calendar-container .fc-event:hover {
          background: linear-gradient(135deg, #3d4b28, #5a6f3b);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(90, 111, 59, 0.3);
        }

        .calendar-container .fc-event-custom {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .calendar-container .fc-event-past {
          opacity: 0.7;
        }

        .calendar-container .fc-day-header {
          color: #3d4b28;
          font-weight: 600;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .calendar-container .fc-daygrid-day {
          border: 1px solid #f1f5f9;
        }

        .calendar-container .fc-daygrid-day:hover {
          background: #f8fafc;
        }

        .calendar-container .fc-day-today {
          background: #f0f9ff !important;
          border: 2px solid #5a6f3b !important;
        }

        .calendar-container .fc-timegrid-slot {
          border-color: #f1f5f9;
        }

        .calendar-container .fc-list-event:hover {
          background: #f8fafc;
        }

        .calendar-container .fc-list-event-title {
          color: #3d4b28;
          font-weight: 600;
        }

        .calendar-container .fc-list-event-time {
          color: #5a6f3b;
          font-weight: 500;
        }

        .calendar-container .fc-scrollgrid {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .calendar-container .fc-col-header-cell {
          background: #f8fafc;
        }

        .calendar-container .fc-daygrid-event-harness {
          margin: 1px;
        }

        .calendar-container .fc-h-event {
          border-radius: 6px;
          border: none;
        }
      `}</style>
    </div>
  )
}
