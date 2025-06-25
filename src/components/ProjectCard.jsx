const statusColors = {
  not_started: 'gray',
  in_progress: 'blue',
  on_hold: 'orange',
  completed: 'green'
}

export default function ProjectCard({ project, onClick }) {
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '500' }}>{project.name}</h3>
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          backgroundColor: `var(--${statusColors[project.status] || 'gray'})`,
          color: 'white',
          fontSize: '0.75rem',
          textTransform: 'capitalize'
        }}>
          {project.status.replace('_', ' ')}
        </span>
      </div>
      <p style={{ 
        color: 'var(--dark)', 
        opacity: 0.7, 
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        {project.description}
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: 'var(--dark)',
        opacity: 0.6
      }}>
        <span>
          {project.endDate 
            ? `Due: ${new Date(project.endDate).toLocaleDateString()}`
            : 'No deadline'}
        </span>
      </div>
    </div>
  )
}