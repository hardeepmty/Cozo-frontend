import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMonitor, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'; // Added FiSettings for the dropdown

export default function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown menu container
  const avatarRef = useRef(null); // Ref for the avatar to detect clicks outside
  const navigate = useNavigate();

  // Effect to close dropdown when clicking outside of it or the avatar
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          // Assuming 'https://cozo-backend.onrender.com/api/auth/me' is correct for your backend
          const res = await axios.get('https://cozo-backend.onrender.com/api/auth/me', config);
          setLoggedInUser(res.data.data);
        } catch (err) {
          console.error('Failed to fetch user data, clearing token:', err);
          localStorage.removeItem('token');
          setLoggedInUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]); // Added navigate to dependency array for clarity

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  if (loading) {
    return (
      <nav className="bg-white p-4 shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-cozo-green text-2xl font-extrabold tracking-tight">
            COZO
          </Link>
          {/* Spinner element with Tailwind's animate-spin and custom color */}
          <div className="border-4 border-gray-200 border-t-cozo-green rounded-full w-6 h-6 animate-spin"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#f4f0e5] py-2 px-4 shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link to="/" className="flex items-center space-x-2 text-cozo-green text-xl font-medium tracking-tight">
          <img src="/logo_cozo.png" alt="COZO logo" className="h-8 w-8 object-contain" />
          <span>COZO</span>
        </Link>

        {/* Navigation Links and User Info */}
        <div className="flex items-center space-x-6 relative"> {/* Added 'relative' for dropdown positioning */}
          {loggedInUser ? (
            <>
              {/* Dashboard Link for logged-in users */}
              <Link to="/dashboard" className="hidden md:flex items-center text-gray-700 hover:text-cozo-green transition duration-200 font-normal">
                <FiMonitor className="mr-1" /> Dashboard
              </Link>
              {/* User Avatar - clickable for dropdown */}
              <img
                ref={avatarRef} // Attach ref here
                src={loggedInUser.avatarUrl || `https://placehold.co/36x36/5a6f3b/ffffff?text=${loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : (loggedInUser.email ? loggedInUser.email.charAt(0).toUpperCase() : '?')}`}
                alt={`${loggedInUser.name}'s Avatar`}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0 cursor-pointer" // Added cursor-pointer
                onClick={toggleDropdown} // Added onClick handler
                onError={(e) => { // Fallback to placeholder if image fails
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/36x36/5a6f3b/ffffff?text=${loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : (loggedInUser.email ? loggedInUser.email.charAt(0).toUpperCase() : '?')}`;
                }}
              />
              {/* Removed direct display of user's first name */}

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  ref={dropdownRef} // Attach ref here
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-40 top-full" // positioned relative to its parent
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-gray-900 font-semibold truncate">{loggedInUser.name || 'User'}</p>
                    <p className="text-gray-600 text-sm truncate">{loggedInUser.email || 'No email'}</p>
                  </div>
                  <button
                    onClick={() => { /* Settings functionality */ setShowDropdown(false); alert('Settings clicked!'); }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FiSettings className="mr-2" /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-black bg-white hover:bg-[#8fa56f] transition duration-200 border-t border-gray-100 mt-1 pt-2"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Log In Link for non-logged-in users */}
              <Link
                to="/login"
                className="text-gray-700 hover:text-cozo-green transition duration-200 font-medium hidden md:block"
              >
                Log In
              </Link>
              {/* Get Started Button for non-logged-in users */}
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cozo-green hover:bg-cozo-green-darken transition duration-200 shadow-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
