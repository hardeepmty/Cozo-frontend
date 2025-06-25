import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import OrgCard from '../components/OrgCard'
import ProjectCard from '../components/ProjectCard'
import CreateOrgModal from './CreateOrgModal'
import JoinOrgModal from '../components/JoinOrgModal'
import Alert from '../components/Alert'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [organizations, setOrganizations] = useState([])
  const [projects, setProjects] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch user data
        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
        setUser(userRes.data.data);

        // Fetch organizations
        const orgsRes = await axios.get('http://localhost:5000/api/orgs', config);
        setOrganizations(orgsRes.data.data);

        // Fetch projects for each organization
        const allProjects = [];
        for (const org of orgsRes.data.data) {
          try {
            const projectsRes = await axios.get(
              `http://localhost:5000/api/projects/${org._id}`,
              config
            );
            allProjects.push(...projectsRes.data.data);
          } catch (err) {
            console.error(`Failed to fetch projects for org ${org._id}:`, err);
          }
        }

        // Sort projects by creation date and get the 3 most recent
        const recentProjects = allProjects
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        
        setProjects(recentProjects);

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleOrgCreated = (newOrg) => {
    setOrganizations([...organizations, newOrg])
    setShowCreateModal(false)
  }

  const handleOrgJoined = (newOrg) => {
    setOrganizations([...organizations, newOrg])
    setShowJoinModal(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar user={user} />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')}
            className="mb-6"
          />
        )}
        
        {/* Header with buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowJoinModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md border border-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Organization
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Organization
            </button>
          </div>
        </div>

        {/* Organizations Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Organizations</h2>
            <span className="text-sm text-gray-500">
              {organizations.length} {organizations.length === 1 ? 'organization' : 'organizations'}
            </span>
          </div>
          
          {organizations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No organizations</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're not part of any organizations yet. Create one or join an existing one to get started!
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Join Organization
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Organization
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map(org => (
                <OrgCard 
                  key={org._id} 
                  org={org} 
                  onClick={() => navigate(`/org/${org._id}`)} 
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
            <span className="text-sm text-gray-500">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
          
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">
                No projects found. Join or create an organization to start working on projects.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  onClick={() => navigate(`/org/${project.organization}/project/${project._id}`)} 
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateOrgModal 
          onClose={() => setShowCreateModal(false)} 
          onOrgCreated={handleOrgCreated} 
        />
      )}
      {showJoinModal && (
        <JoinOrgModal 
          onClose={() => setShowJoinModal(false)} 
          onOrgJoined={handleOrgJoined} 
        />
      )}
    </div>
  )
}