import { FiClock, FiCalendar, FiFlag, FiFileText, FiUsers } from 'react-icons/fi';

export default function ProjectInfo({ project }) {
  if (!project) return null;

  const statusColors = {
    not_started: { bg: '#e2e8f0', text: '#334155' },
    in_progress: { bg: '#bfdbfe', text: '#1e40af' },
    on_hold: { bg: '#fed7aa', text: '#9a3412' },
    completed: { bg: '#bbf7d0', text: '#166534' }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Project Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FiFileText size={24} />
        </div>
        <div>
          <h3 style={{ 
            fontWeight: '600',
            fontSize: '1.25rem',
            marginBottom: '0.25rem'
          }}>
            {project.name}
          </h3>
          <p style={{ color: '#64748b' }}>{project.description}</p>
        </div>
      </div>

      {/* Project Details */}
      <div style={{ padding: '1.5rem' }}>
        {/* Status */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: statusColors[project.status].bg,
          color: statusColors[project.status].text,
          borderRadius: '8px'
        }}>
          <FiFlag />
          <span style={{ textTransform: 'capitalize' }}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        {/* Timeline */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              color: '#64748b'
            }}>
              <FiCalendar size={16} />
              <span style={{ fontSize: '0.875rem' }}>Start Date</span>
            </div>
            <p style={{ fontWeight: '500' }}>
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>

          <div style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              color: '#64748b'
            }}>
              <FiClock size={16} />
              <span style={{ fontSize: '0.875rem' }}>End Date</span>
            </div>
            <p style={{ fontWeight: '500' }}>
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <FiFileText size={16} />
            Problem Statement
          </h4>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            {project.problemStatement}
          </div>
        </div>

        {/* Summary */}
        {project.problemStatementSummary && (
          <div>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              <FiFileText size={16} />
              AI Summary
            </h4>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              color: '#166534'
            }}>
              {project.problemStatementSummary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}