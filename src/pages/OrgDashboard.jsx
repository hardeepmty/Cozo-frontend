import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import TeamMembers from '../components/TeamMembers';
import ProjectInfo from '../components/ProjectInfo';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import Alert from '../components/Alert';
import CreateTeamModal from '../components/CreateTeamModal';
import InviteUsersModal from '../components/InviteUsersModal';

export default function OrgDashboard() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [userOrgRole, setUserOrgRole] = useState(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
        const currentUserId = userRes.data.data._id;
        setLoggedInUserId(currentUserId);

        const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config);
        setOrg(orgRes.data.data);
        setMembers(orgRes.data.data.members);

        const currentUserMember = orgRes.data.data.members.find(
          member => member.user && member.user._id === currentUserId
        );
        setUserOrgRole(currentUserMember ? currentUserMember.role : null);

        const projectsRes = await axios.get(`http://localhost:5000/api/projects/${orgId}`, config);
        setProjects(projectsRes.data.data);
        if (projectsRes.data.data.length > 0) {
          setSelectedProject(projectsRes.data.data[0]);
        }

        const teamsRes = await axios.get(`http://localhost:5000/api/teams/${orgId}`, config);
        setTeams(teamsRes.data.data);

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load organization data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [orgId, navigate]);

  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/projects/${orgId}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProjects([...projects, res.data.data]);
      setShowProjectModal(false);
      setSelectedProject(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        {
          ...taskData,
          project: selectedProject ? selectedProject._id : null,
          organization: orgId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setShowTaskModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/teams/${orgId}`,
        teamData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTeams([...teams, res.data.data]);
      setShowTeamModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team');
    }
  };

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    setSelectedProject(project);
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleInviteSuccess = (message) => {
    setError(message);
    setShowInviteUsersModal(false);
    // Re-fetch organization data to update member list
    fetchOrgData();
  };

  const handleInviteError = (message) => {
    setError(message);
  };

  const isAdminInOrg = userOrgRole === 'admin';

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar user={org} />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={org} activePage="orgDashboard" />
      
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        {/* Organization Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{org?.name}</h1>
              <p className="text-gray-600 mt-1">{org?.description}</p>
            </div>
            
            {isAdminInOrg && (
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </button>

                <button
                  onClick={() => setShowTeamModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  New Team
                </button>

                <button
                  onClick={() => setShowInviteUsersModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite Users
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Project:</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedProject?._id || ''}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
              >
                <option value="">Select a Project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {selectedProject && (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/org/${orgId}/project/${selectedProject._id}/utility`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Project Utility
                  </button>

                  <button
                    onClick={() => navigate(`/org/${orgId}/project/${selectedProject._id}/calendar`, {
                      state: { userOrgRole: userOrgRole, loggedInUserId: loggedInUserId }
                    })}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Kanban Board */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Tasks for {selectedProject.name}</h2>
                  {isAdminInOrg && (
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      New Task
                    </button>
                  )}
                </div>
                <KanbanBoard
                  projectId={selectedProject._id}
                  orgId={orgId}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No project selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a project from the dropdown above, or create a new project to get started.
                </p>
                {isAdminInOrg && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      New Project
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Project Info and Team */}
          <div className="space-y-6">
            {selectedProject && (
              <ProjectInfo project={selectedProject} />
            )}
            <TeamMembers members={members} teams={teams} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProjectModal && (
        <CreateProjectModal
          orgId={orgId}
          onClose={() => setShowProjectModal(false)}
          onCreate={handleCreateProject}
          teams={teams}
        />
      )}
      
      {showTaskModal && selectedProject && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          teams={teams}
          members={members}
          projectId={selectedProject._id}
          organizationId={orgId}
        />
      )}
      
      {showTeamModal && (
        <CreateTeamModal
          show={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          onSubmit={handleCreateTeam}
          members={members}
        />
      )}
      
      {showInviteUsersModal && (
        <InviteUsersModal
          show={showInviteUsersModal}
          onClose={() => setShowInviteUsersModal(false)}
          orgId={orgId}
          currentOrgMembers={members.map(m => m.user)}
          onInviteSuccess={handleInviteSuccess}
          onInviteError={handleInviteError}
        />
      )}
    </div>
  );
}