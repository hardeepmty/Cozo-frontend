import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiLink, FiInfo } from 'react-icons/fi'; // Import icons
import Alert from './Alert'; // Assuming you have an Alert component

export default function EventFormModal({
  show,
  onClose,
  onSubmit, // Function to call when submitting (for create/update)
  eventData = {}, // Existing event data for editing, or empty object for new
  isEditMode = false, // Flag to indicate if it's an edit operation (implies editable)
  isViewMode = false, // <--- NEW: Flag to indicate pure view-only mode
  onDelete, // Function to call for deleting an event
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    googleMeetLink: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Populate form data based on mode
    if (show) { // Only update when modal is shown
        setError(''); // Clear errors on modal open

        if (isViewMode || isEditMode) { // If viewing or editing an existing event
            setFormData({
                title: eventData.title || '',
                description: eventData.extendedProps.description || '',
                start: eventData.start ? new Date(eventData.start).toISOString().slice(0, 16) : '',
                end: eventData.end ? new Date(eventData.end).toISOString().slice(0, 16) : '',
                allDay: eventData.allDay || false,
                googleMeetLink: eventData.extendedProps.googleMeetLink || '',
            });
        } else { // Create new event mode
            setFormData({
                title: '',
                description: '',
                start: eventData.start ? new Date(eventData.start).toISOString().slice(0, 16) : '', // Pre-fill if date clicked
                end: eventData.end ? new Date(eventData.end).toISOString().slice(0, 16) : '',
                allDay: eventData.allDay || false,
                googleMeetLink: '',
            });
        }
    }
  }, [show, isEditMode, isViewMode, eventData]); // Add isViewMode to dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return; // Prevent submission if in view-only mode

    if (!formData.title || !formData.start) {
      setError('Title and Start Date/Time are required.');
      return;
    }
    // Convert to Date objects for backend
    const dataToSubmit = {
      ...formData,
      start: new Date(formData.start),
      end: formData.end ? new Date(formData.end) : null,
    };
    onSubmit(dataToSubmit);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(eventData.id); // Pass the custom event ID
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#172b4d' }}>
            {isViewMode ? 'Event Details' : (isEditMode ? 'Edit Event' : 'Create New Event')}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>
            <FiX />
          </button>
        </div>

        {error && <Alert message={error} type="error" />}

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <FiInfo style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Event Title
            </label>
            {isViewMode ? (
              <p style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                {formData.title || 'N/A'}
              </p>
            ) : (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description
            </label>
            {isViewMode ? (
              <p style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                {formData.description || 'N/A'}
              </p>
            ) : (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical' }}
              />
            )}
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <FiCalendar style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Start Date/Time
              </label>
              {isViewMode ? (
                <p style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                  {formData.start ? new Date(formData.start).toLocaleString() : 'N/A'}
                </p>
              ) : (
                <input
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <FiCalendar style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                End Date/Time
              </label>
              {isViewMode ? (
                <p style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
                  {formData.end ? new Date(formData.end).toLocaleString() : 'N/A'}
                </p>
              ) : (
                <input
                  type="datetime-local"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            {isViewMode ? (
              <p style={{ fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  readOnly // Always read-only in view mode
                  style={{ marginRight: '0.5rem', pointerEvents: 'none' }} // Disable clicks
                />
                All Day Event: {formData.allDay ? 'Yes' : 'No'}
              </p>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                All Day Event
              </label>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <FiLink style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Google Meet / Zoom / Teams Link
            </label>
            {isViewMode ? (
              formData.googleMeetLink ? (
                <a
                  href={formData.googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc', color: '#2563eb', textDecoration: 'underline' }}
                >
                  {formData.googleMeetLink}
                </a>
              ) : (
                <p style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>N/A</p>
              )
            ) : (
              <input
                type="url"
                name="googleMeetLink"
                value={formData.googleMeetLink}
                onChange={handleChange}
                placeholder="e.g., https://meet.google.com/xyz-abc"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            )}
          </div>

          {isViewMode && eventData.extendedProps.createdBy && (
              <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <p style={{ fontWeight: '500', color: '#64748b' }}>Created By: <strong>{eventData.extendedProps.createdBy}</strong></p>
              </div>
          )}


          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            {!isViewMode && isEditMode && onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                style={{
                  backgroundColor: '#dc3545', // Red for delete
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && ( // Only show submit button if not in view-only mode
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#28a745', // Green for save/create
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}
              >
                {isEditMode ? 'Save Changes' : 'Create Event'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
