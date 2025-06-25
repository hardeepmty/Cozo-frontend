// styles/index.js (Your existing file)
export const colors = {
  primary: '#4F46E5', // A more vibrant indigo
  secondary: '#6366F1', // Lighter shade for hover states
  light: '#F9FAFB', // Off-white for backgrounds
  dark: '#1F2937', // Dark gray for text
  medium: '#4B5563', // Medium gray for secondary text
  success: '#10B981', // Green for success
  danger: '#EF4444', // Red for danger
  border: '#D1D5DB', // Light gray for borders
  white: '#FFFFFF',
};

export const baseStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '12px', // Slightly more rounded
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Softer, more pronounced shadow
    padding: '32px', // Increased padding
    margin: '20px 0',
    transition: 'transform 0.2s ease-in-out',
    // '&:hover': { transform: 'translateY(-5px)' }, // Cannot be directly inlined
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px', // Slightly more rounded
    padding: '12px 24px', // More generous padding
    fontSize: '17px', // Slightly larger font
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    // '&:hover': { backgroundColor: colors.secondary, transform: 'translateY(-1px)' }, // Cannot be directly inlined
    // '&:active': { transform: 'translateY(0)' }, // Cannot be directly inlined
  },
  input: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '16px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    // '&:focus': { ... } // Cannot be directly inlined
  },
  // Typography
  h1: {
    fontSize: '56px', // Larger heading
    color: colors.dark,
    marginBottom: '24px',
    fontWeight: '700', // Bolder
    letterSpacing: '-1px', // Tighter for larger text
  },
  h3: {
    fontSize: '24px',
    color: colors.dark,
    marginBottom: '12px',
    fontWeight: '600',
  },
  p: {
    fontSize: '18px',
    color: colors.medium,
    lineHeight: '1.6',
  }
};

// Media queries for responsiveness (will be used by JS logic)
export const mediaQueries = {
  tablet: 768, // Convert to number for JS comparison
  mobile: 480, // Convert to number for JS comparison
};