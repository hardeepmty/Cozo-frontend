import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          // Assuming 'http://localhost:5000/api/auth/me' is correct for your backend
          const res = await axios.get('http://localhost:5000/api/auth/me', config);
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <nav className="bg-white text-nav-link p-4 shadow-md border-b border-border-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-text-heading text-2xl font-bold tracking-tight">
            TaskMaster
          </Link>
          {/* Spinner element */}
          <div className="border-4 border-gray-200 border-t-brand-green-button rounded-full w-6 h-6 animate-spin-custom"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white text-nav-link p-4 shadow-md border-b border-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-text-heading text-2xl font-bold tracking-tight">
          COZO
        </Link>

        <div className="flex items-center space-x-6">
          {loggedInUser ? (
            <>
              <Link to="/dashboard" className="hidden md:block text-nav-link hover:text-text-heading transition duration-200 font-medium">
                Dashboard
              </Link>
              <img
                src={loggedInUser.avatarUrl || '/user.png'} // Placeholder for user avatar
                alt={`${loggedInUser.name}'s Avatar`}
                className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
              <span className="text-text-heading font-medium whitespace-nowrap hidden sm:block">
                {loggedInUser.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition duration-200 shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-nav-link hover:text-text-heading transition duration-200 font-medium hidden md:block" // Hidden on small screens
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nav-blue hover:bg-blue-600 transition duration-200 shadow-sm"
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