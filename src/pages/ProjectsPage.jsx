import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Please verify these paths relative to your ProjectsPage.js location
// For example, if ProjectsPage.js is in src/pages/, these components should be in src/components/
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';

export default function ProjectsPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null); // To store organization details for sidebar
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectsData = async () => {
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

        // Fetch organization details (for Sidebar and page title)
        const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config);
        setOrg(orgRes.data.data);

        // Fetch all projects for this organization
        // Ensure your backend's project route is configured to populate createdBy and teams
        // e.g., Project.find({organization: orgId}).populate('createdBy', 'name').populate('teams', 'name')
        const projectsRes = await axios.get(`http://localhost:5000/api/projects/${orgId}`, config);
        setProjects(projectsRes.data.data);

      } catch (err) {
        console.error('Failed to fetch projects data:', err);
        setError(err.response?.data?.error || 'Failed to load projects.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [orgId, navigate]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={org} activePage="projects" />
        <div className="flex-1 flex justify-center items-center p-8">
          <p className="text-gray-700 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={org} activePage="projects" />

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full ml-0 md:ml-64" >
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Projects in {org?.name || 'Organization'}
        </h1>

        {/* Alert for errors */}
        {error && <Alert message={error} type="error" />}

        {/* Conditional rendering for no projects vs. projects table */}
        {projects.length === 0 ? (
          <div className="text-center p-8 text-gray-600 bg-white rounded-lg shadow-md">
            <p className="text-lg mb-2">No projects found for this organization.</p>
            <p className="text-base">If you're an admin, you can create a new project from the organization dashboard.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Problem Statement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teams</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out"
                    onClick={() => navigate(`/org/${orgId}/project/${project._id}`)} // Navigate to project dashboard on row click
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">{project.description || 'No description'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">{project.problemStatement || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                         {project.status ? project.status.replace(/_/g, ' ').toUpperCase() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{project.createdBy?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {project.teams && project.teams.length > 0
                        ? project.teams.map(team => (
                            <span key={team._id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                              {team.name}
                            </span>
                          ))
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
