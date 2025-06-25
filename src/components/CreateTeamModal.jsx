import { useState } from 'react';

export default function CreateTeamModal({ 
  show, 
  onClose, 
  onSubmit, 
  members 
}) {
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    members: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setTeamData(prev => ({ ...prev, members: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(teamData);
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
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create New Team</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}>
              Team Name
            </label>
            <input
              type="text"
              name="name"
              value={teamData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={teamData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                minHeight: '100px'
              }}
            />
          </div>

<div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '4px', padding: '0.5rem' }}>
  {members.map(member => {
    const id = member.user._id;
    const isChecked = teamData.members.includes(id);

    return (
      <div key={id} style={{ marginBottom: '0.5rem' }}>
        <label>
          <input
            type="checkbox"
            value={id}
            checked={isChecked}
            onChange={(e) => {
              const updated = e.target.checked
                ? [...teamData.members, id]
                : teamData.members.filter(m => m !== id);
              setTeamData(prev => ({ ...prev, members: updated }));
            }}
            style={{ marginRight: '0.5rem' }}
          />
          {member.user.name} ({member.user.email})
        </label>
      </div>
    );
  })}
</div>


          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}