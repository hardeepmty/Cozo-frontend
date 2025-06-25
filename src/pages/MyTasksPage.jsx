import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const navigate = useNavigate();

  // Status mapping to match your backend
  const statusMapping = {
    'not_started': 'todo',
    'in_progress': 'in-progress',
    'completed': 'done'
  };

  // Tailwind equivalent colors for task status (used for left border)
  const statusTailwindColors = {
    'todo': 'border-yellow-500',     // Matches #ffbe0b
    'in-progress': 'border-blue-500', // Matches #3a86ff
    'done': 'border-green-500'      // Matches #06d6a0
  };

  // Tailwind equivalent colors for priority badges
  const priorityTailwindClasses = {
    'critical': { bg: 'bg-red-100', text: 'text-red-700' },     // Matches #ffcdd2, #d32f2f
    'high': { bg: 'bg-orange-100', text: 'text-orange-700' },   // Matches #ffebee, #ff5252 (adjusted to orange for better clarity)
    'medium': { bg: 'bg-yellow-100', text: 'text-yellow-700' }, // Matches #fffae6, #ffab00
    'low': { bg: 'bg-gray-100', text: 'text-gray-600' }         // Matches #f0f0f0, #5e6c84
  };


  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/tasks/my-tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Transform backend data to match our frontend format
        const transformedTasks = res.data.data.map(task => ({
          ...task,
          // Normalize status to match our frontend values
          status: statusMapping[task.status] || task.status
        }));

        setTasks(transformedTasks);
        setFilteredTasks(transformedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        // Display an alert for the user if there's an error
        // You might need a state variable for an error message and pass it to an Alert component
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply filter
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }

    // Apply sorting
    if (sortBy === 'dueDate') {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      result.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    }

    setFilteredTasks(result);
  }, [tasks, filter, sortBy]);

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      // Find the original status key for backend
      const backendStatus = Object.keys(statusMapping).find(
        key => statusMapping[key] === newStatus
      ) || newStatus; // Fallback to newStatus if no mapping found

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { status: backendStatus }, // Send the backend-compatible status
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to update task:', err);
      // Implement an alert for the user here if needed
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700 text-lg">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-select" className="text-gray-700 font-medium">Filter:</label>
          <select
            id="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-gray-700 font-medium">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center p-8 text-gray-600 bg-white rounded-lg shadow-md">
            <p className="text-lg">No tasks found matching your criteria.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-6 rounded-lg bg-white shadow-md border-l-4 ${statusTailwindColors[task.status] || 'border-gray-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900 leading-tight mr-4">{task.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap
                              ${priorityTailwindClasses[task.priority]?.bg || 'bg-gray-100'}
                              ${priorityTailwindClasses[task.priority]?.text || 'text-gray-600'}`}
                >
                  {task.priority || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">{task.project?.name || 'No Project'}</span>
                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed my-4 overflow-hidden line-clamp-3">
                {task.description || 'No description provided'}
              </p>

              {/* Status Update Select */}
              <div className="mt-4">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;
