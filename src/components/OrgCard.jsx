export default function OrgCard({ org, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <h3 style={{ 
        fontSize: '1.25rem', 
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'var(--primary)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.75rem'
        }}>
          {org.name.charAt(0).toUpperCase()}
        </span>
        {org.name}
      </h3>
      <p style={{ color: 'var(--dark)', opacity: 0.7, marginBottom: '1rem' }}>
        {org.description || 'No description provided'}
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: 'var(--dark)',
        opacity: 0.6
      }}>
        <span>Join Code: {org.joinCode}</span>
        <span>{new Date(org.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}