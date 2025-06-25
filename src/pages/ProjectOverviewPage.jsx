import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
// !!! IMPORTANT: Please VERIFY these import paths based on your EXACT file structure.
// If ProjectOverviewPage.js is in 'src/pages/', and Sidebar/Alert are in 'src/components/', these paths are correct.
// If your structure is different (e.g., ProjectOverviewPage is in 'src/views/projects/',
// or Sidebar/Alert are in 'src/shared/components/'), you MUST adjust these paths.
// Example for a different structure:
// import Sidebar from '../../shared/components/Sidebar';
// import Alert from '../../../../shared/components/Alert';
import Sidebar from '../components/Sidebar'; // VERIFY THIS PATH
import Alert from '../components/Alert';     // VERIFY THIS PATH

// Ensure 'react-icons' is installed: npm install react-icons
import { FiClock, FiCalendar, FiTarget, FiActivity, FiUsers, FiUser } from 'react-icons/fi';

export default function ProjectOverviewPage() {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [org, setOrg] = useState(null); // For sidebar context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Colors for different task statuses in the Pie Chart
  const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A283C9']; // Added an extra color

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch organization details for sidebar
        const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config);
        setOrg(orgRes.data.data);

        // Fetch project details
        const projectRes = await axios.get(`http://localhost:5000/api/projects/single/${projectId}`, config);
        setProject(projectRes.data.data);

        // Fetch tasks for this project to calculate completion
        const tasksRes = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, config);
        setTasks(tasksRes.data.data);

      } catch (err) {
        console.error('Failed to fetch project data:', err);
        setError(err.response?.data?.error || 'Failed to load project details.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response?.status === 404) {
          navigate(`/org/${orgId}/projects`); // Project not found, go back to all projects
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [orgId, projectId, navigate]);

  // Display loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={org} activePage={`project-${projectId}`} />
        <div className="flex-1 flex justify-center items-center p-8">
          <p className="text-gray-700 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Display error or "not found" state if project data is missing
  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={org} activePage={`project-${projectId}`} />
        <div className="flex-1 flex justify-center items-center p-8 ">
          {error ? <Alert message={error} type="error" /> : <p className="text-gray-700 text-lg">Project not found.</p>}
        </div>
      </div>
    );
  }

  // --- Data preparation for Charts ---
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(taskStatusCounts).map((status) => ({
    name: status.replace(/_/g, ' ').toUpperCase(),
    value: taskStatusCounts[status],
  }));

  // Bar chart data for project timeline
  const formattedTimelineData = [
    {
      name: project.name,
      'Start Date': project.startDate ? new Date(project.startDate).toLocaleDateString() : null,
      'End Date': project.endDate ? new Date(project.endDate).toLocaleDateString() : null
    }
  ].filter(item => item['Start Date'] !== null || item['End Date'] !== null); // Ensure at least one date exists

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={org} activePage={`project-${projectId}`} />
      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full ml-0 md:ml-64">
        {/* Project Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{project.description}</p>

        {/* Alert for errors */}
        {error && <Alert message={error} type="error" />}

        {/* Project Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-gray-700 text-base">
            <div className="flex items-center">
              <FiTarget className="mr-3 text-blue-600 text-xl" />
              <strong>Problem Statement:</strong> <span className="ml-2">{project.problemStatement || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <FiActivity className="mr-3 text-blue-600 text-xl" />
              <strong>Status:</strong>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {project.status ? project.status.replace(/_/g, ' ').toUpperCase() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center">
              <FiUser className="mr-3 text-blue-600 text-xl" />
              <strong>Created By:</strong> <span className="ml-2">{project.createdBy?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="mr-3 text-blue-600 text-xl" />
              <strong>Start Date:</strong> <span className="ml-2">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="mr-3 text-blue-600 text-xl" />
              <strong>End Date:</strong> <span className="ml-2">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-start"> {/* Use items-start for multiline teams */}
              <FiUsers className="mr-3 text-blue-600 text-xl mt-1" />
              <strong>Teams:</strong>{' '}
              <div className="ml-2 flex flex-wrap gap-2">
                {project.teams && project.teams.length > 0
                  ? project.teams.map(team => (
                      <span key={team._id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {team.name}
                      </span>
                    ))
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Completion Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Completion Status</h2>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8" // Default fill, overridden by Cell colors
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    className="text-sm" // Apply text size to labels within pie chart
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600 text-lg">No tasks found for this project to calculate completion.</p>
            )}
          </div>

          {/* Project Timeline (Start and End Dates) - Simple Bar Chart representation */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Timeline</h2>
            {formattedTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={formattedTimelineData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200" />
                  <XAxis type="category" hide /> {/* Hide X-axis as dates are labels */}
                  <YAxis type="category" dataKey="name" width={80} className="text-xs" />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="Start Date" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="End Date" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600 text-lg">No start or end date specified for this project.</p>
            )}
          </div>
        </div>
        {/* Optional: View All Tasks Button */}
        {tasks.length > 0 && (
            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate(`/org/${orgId}/project/${projectId}/tasks`)} // Assuming a tasks page route
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md
                               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition duration-150 ease-in-out text-lg"
                >
                    View All Tasks
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
