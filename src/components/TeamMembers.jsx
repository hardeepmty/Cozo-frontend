import { useState } from 'react';
import { FiUsers, FiPhone, FiMail, FiUser } from 'react-icons/fi';

export default function TeamMembers({ members, teams }) {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            backgroundColor: activeTab === 'members' ? '#f8fafc' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: '500'
          }}
        >
          <FiUsers /> Members
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            backgroundColor: activeTab === 'teams' ? '#f8fafc' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: '500'
          }}
        >
          <FiUser /> Teams
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        {activeTab === 'members' ? (
          <div>
            {members.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                No members in this organization
              </p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {members.map((member) => (
                  <li key={member.user._id} style={{
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {member.user.name}
                      </p>
                      <p style={{ 
                        fontSize: '0.875rem',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: member.role === 'admin' ? '#dcfce7' : '#f1f5f9',
                          color: member.role === 'admin' ? '#166534' : '#334155',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {member.role}
                        </span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FiPhone size={16} />
                      </button>
                      <button style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FiMail size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            {teams.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                No teams created yet
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {teams.map((team) => (
                  <div key={team._id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      borderColor: '#bae6fd',
                      boxShadow: '0 0 0 3px rgba(186, 230, 253, 0.5)'
                    }
                  }}>
                    <h4 style={{ 
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#e0f2fe',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0369a1'
                      }}>
                        {team.name.charAt(0)}
                      </span>
                      {team.name}
                    </h4>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#64748b',
                      marginBottom: '0.5rem'
                    }}>
                      {team.description || 'No description'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        {team.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}