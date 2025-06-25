// components/InviteUsersModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from './Alert'; // Assuming you have an Alert component

export default function InviteUsersModal({
  show,
  onClose,
  orgId, // <--- New prop: orgId
  currentOrgMembers, // List of users already in the current organization
  onInviteSuccess, // <--- New prop: callback for success
  onInviteError // <--- New prop: callback for error
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [allPlatformUsers, setAllPlatformUsers] = useState([]); // <--- State for users fetched inside modal
  const [loadingUsers, setLoadingUsers] = useState(true); // <--- Loading state for fetching users
  const [sendingInvites, setSendingInvites] = useState(false); // <--- Loading state for sending invites
  const [modalError, setModalError] = useState(''); // Internal error state for the modal

  // Fetch all platform users when the modal becomes visible
  useEffect(() => {
    if (show && orgId) {
      const fetchPlatformUsers = async () => {
        setLoadingUsers(true);
        setModalError(''); // Clear previous errors
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const usersRes = await axios.get('http://localhost:5000/api/auth/users', config); // API to fetch all users
          setAllPlatformUsers(usersRes.data.data);
        } catch (err) {
          console.error('Failed to fetch platform users:', err);
          setModalError(err.response?.data?.error || 'Failed to load users for invitation.');
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchPlatformUsers();
    }
  }, [show, orgId]); // Re-fetch when modal visibility or orgId changes

  // Reset selected users and search term when modal is closed
  useEffect(() => {
    if (!show) {
      setSearchTerm('');
      setSelectedUserIds([]);
      setModalError('');
    }
  }, [show]);

  // Filter out users who are already members of the current organization
  const nonOrgMembers = allPlatformUsers.filter(user =>
    !currentOrgMembers.some(member => member._id === user._id)
  );

  const filteredUsers = nonOrgMembers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      setModalError('Please select at least one user to invite.');
      return;
    }

    setSendingInvites(true);
    setModalError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // --- START OF THE ONLY CHANGES ---
      // Get the emails corresponding to the selected user IDs
      const selectedUserEmails = allPlatformUsers
        .filter(user => selectedUserIds.includes(user._id))
        .map(user => user.email);

      if (selectedUserEmails.length === 0) {
        setModalError('Could not retrieve emails for selected users. Please try again.');
        setSendingInvites(false);
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/orgs/${orgId}/invite`,
        { emails: selectedUserEmails }, // <--- CHANGED FROM userIds TO emails
        config
      );
      // --- END OF THE ONLY CHANGES ---

      console.log('Invite sent response:', res.data);
      onInviteSuccess(res.data.message || 'Invitations sent successfully!');
      // Modal will close via onClose prop from parent (OrgDashboard)
    } catch (err) {
      console.error('Failed to send invitations:', err);
      const errorMessage = err.response?.data?.error || 'Failed to send invitations.';
      setModalError(errorMessage);
      onInviteError(errorMessage); // Pass error back to parent as well
    } finally {
      setSendingInvites(false);
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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Invite Users to Organization</h2>

        {modalError && <Alert message={modalError} type="error" />}

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
            }}
            disabled={loadingUsers} // Disable search while loading
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0.5rem' }}>
          {loadingUsers ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>
                {searchTerm ? "No matching users found or all users are already members." : "All platform users are already members of this organization."}
            </p>
          ) : (
            filteredUsers.map(user => (
              <div key={user._id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                backgroundColor: selectedUserIds.includes(user._id) ? '#eff6ff' : 'transparent',
                ':hover': {
                    backgroundColor: selectedUserIds.includes(user._id) ? '#eff6ff' : '#f9fafb'
                }
              }}>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                  style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                  disabled={sendingInvites} // Disable checkboxes while sending
                />
                <div>
                  <strong style={{ display: 'block' }}>{user.name}</strong>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            disabled={sendingInvites} // Disable cancel button while sending
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              opacity: selectedUserIds.length > 0 && !sendingInvites ? 1 : 0.6,
              cursor: selectedUserIds.length > 0 && !sendingInvites ? 'pointer' : 'not-allowed'
            }}
            disabled={selectedUserIds.length === 0 || sendingInvites} // Disable if no users selected or sending
          >
            {sendingInvites ? 'Sending...' : `Send Invite (${selectedUserIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}