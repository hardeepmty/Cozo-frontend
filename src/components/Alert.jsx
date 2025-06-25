import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Alert({ message, type = 'info', onClose }) {
  if (!message) return null;

  const alertStyles = {
    info: {
      bg: '#eff6ff',
      text: '#1d4ed8',
      icon: <FiInfo />
    },
    success: {
      bg: '#ecfdf5',
      text: '#047857',
      icon: <FiCheckCircle />
    },
    error: {
      bg: '#fef2f2',
      text: '#b91c1c',
      icon: <FiAlertCircle />
    },
    warning: {
      bg: '#fffbeb',
      text: '#b45309',
      icon: <FiAlertCircle />
    }
  };

  const currentStyle = alertStyles[type] || alertStyles.info;

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: currentStyle.bg,
      color: currentStyle.text,
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      position: 'relative'
    }}>
      <div style={{ marginTop: '2px' }}>
        {currentStyle.icon}
      </div>
      <div style={{ flex: 1 }}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: currentStyle.text,
            cursor: 'pointer',
            marginLeft: '0.5rem'
          }}
        >
          <FiX />
        </button>
      )}
    </div>
  );
}