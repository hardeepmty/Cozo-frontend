"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import KanbanBoard from "../components/KanbanBoard"
import TeamMembers from "../components/TeamMembers"
import ProjectInfo from "../components/ProjectInfo"
import CreateProjectModal from "../components/CreateProjectModal"
import CreateTaskModal from "../components/CreateTaskModal"
import Alert from "../components/Alert"
import CreateTeamModal from "../components/CreateTeamModal"
import InviteUsersModal from "../components/InviteUsersModal"

export default function OrgDashboard() {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const [org, setOrg] = useState(null)
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeView, setActiveView] = useState("overview") // overview, kanban, team
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [loggedInUserId, setLoggedInUserId] = useState(null)
  const [userOrgRole, setUserOrgRole] = useState(null)

  const fetchOrgData = async () => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const userRes = await axios.get("http://localhost:5000/api/auth/me", config)
      const currentUserId = userRes.data.data._id
      setLoggedInUserId(currentUserId)

      const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config)
      setOrg(orgRes.data.data)
      setMembers(orgRes.data.data.members)

      const currentUserMember = orgRes.data.data.members.find(
        (member) => member.user && member.user._id === currentUserId,
      )
      setUserOrgRole(currentUserMember ? currentUserMember.role : null)

      const projectsRes = await axios.get(`http://localhost:5000/api/projects/${orgId}`, config)
      setProjects(projectsRes.data.data)
      if (projectsRes.data.data.length > 0) {
        setSelectedProject(projectsRes.data.data[0])
      }

      const teamsRes = await axios.get(`http://localhost:5000/api/teams/${orgId}`, config)
      setTeams(teamsRes.data.data)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load organization data")
      if (err.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrgData()
  }, [orgId, navigate])

  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(`http://localhost:5000/api/projects/${orgId}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProjects([...projects, res.data.data])
      setShowProjectModal(false)
      setSelectedProject(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project")
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          ...taskData,
          project: selectedProject ? selectedProject._id : null,
          organization: orgId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setShowTaskModal(false)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task")
    }
  }

  const handleCreateTeam = async (teamData) => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(`http://localhost:5000/api/teams/${orgId}`, teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTeams([...teams, res.data.data])
      setShowTeamModal(false)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team")
    }
  }

  const handleProjectSelect = (projectId) => {
    const project = projects.find((p) => p._id === projectId)
    setSelectedProject(project)
    if (project) {
      setActiveView("kanban")
    }
  }

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task")
    }
  }

  const handleInviteSuccess = (message) => {
    setError(message)
    setShowInviteUsersModal(false)
    fetchOrgData()
  }

  const handleInviteError = (message) => {
    setError(message)
  }

  const isAdminInOrg = userOrgRole === "admin"

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-64">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className="w-16 h-16 border-4 border-opacity-30 rounded-full animate-spin"
                style={{ borderColor: "#5a6f3b", borderTopColor: "#3d4b28" }}
              ></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4b28" }}>
                Loading Organization
              </h3>
              <p className="text-gray-600">Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
      <Sidebar user={org} activePage="orgDashboard" />

      <div className="flex-1 ml-0 md:ml-64">
        {error && (
          <div className="p-4">
            <Alert message={error} type="error" onClose={() => setError("")} className="mb-4" />
          </div>
        )}

        {/* Top Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            {/* Organization Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                >
                  {org?.name?.charAt(0)?.toUpperCase() || "O"}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: "#3d4b28" }}>
                    {org?.name}
                  </h1>
                  <p className="text-gray-600">{org?.description}</p>
                </div>
              </div>

              {isAdminInOrg && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>New Project</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    style={{ backgroundColor: "black" }}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>New Team</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowInviteUsersModal(true)}
                    className="px-4 py-2 rounded-xl font-semibold border-2 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{ color: "#5a6f3b", borderColor: "#5a6f3b",backgroundColor:"#f3f4f6" }}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Invite Users</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveView("overview")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeView === "overview"
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                  style={{
                    background: activeView === "overview" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView("kanban")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeView === "kanban"
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                  style={{
                    background: activeView === "kanban" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent", // Changed to olive green
                  }}
                >
                  Project Board
                </button>
                <button
                  onClick={() => setActiveView("team")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeView === "team" ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                  style={{
                    background: activeView === "team" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent", // Changed to olive green
                  }}
                >
                  Team & Members
                </button>
              </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Overview View */}
          {activeView === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Projects</p>
                      <p className="text-3xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                        {projects.length}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Teams</p>
                      <p className="text-3xl font-bold mt-1" style={{ color: "#3b82f6" }}>
                        {teams.length}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#3b82f6" }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Members</p>
                      <p className="text-3xl font-bold mt-1" style={{ color: "#f59e0b" }}>
                        {members.length}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#f59e0b" }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Your Role</p>
                      <p className="text-lg font-bold mt-1" style={{ color: "#3d4b28" }}>
                        {userOrgRole?.toUpperCase() || "MEMBER"}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
                    ></div>
                    <h2 className="text-2xl font-bold" style={{ color: "#3d4b28" }}>
                      Projects
                    </h2>
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d4b28" }}>
                      No projects yet
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                      Create your first project to start organizing tasks and collaborating with your team.
                    </p>
                    {isAdminInOrg && (
                      <button
                        onClick={() => setShowProjectModal(true)}
                        className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ background: "linear-gradient(to right, #5a6f3b, #3d4b28)" }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Create Project</span>
                        </div>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => handleProjectSelect(project._id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold" style={{ color: "#3d4b28" }}>
                            {project.name}
                          </h3>
                          <div
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                            }}
                          >
                            Active
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                          <button
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProjectSelect(project._id)
                            }}
                          >
                            View Board →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kanban Board View - Full Width */}
          {activeView === "kanban" && (
            <div className="space-y-6">
              {/* Project Selector */}
              {projects.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" style={{ color: "#3d4b28" }}>
                        Select Project:
                      </label>
                      <select
                        value={selectedProject?._id || ""}
                        onChange={(e) => handleProjectSelect(e.target.value)}
                        className="w-full lg:w-96 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                        style={{
                          borderColor: "#5a6f3b",
                          focusRingColor: "#5a6f3b",
                        }}
                      >
                        <option value="">Select a Project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedProject && (
                      <div className="flex flex-wrap gap-3">
                        {isAdminInOrg && (
                          <button
                            onClick={() => setShowTaskModal(true)}
                            className="px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                            style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                          >
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              <span>New Task</span>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/org/${orgId}/project/${selectedProject._id}/utility`)}
                          className="px-4 py-2 rounded-xl font-semibold border-2 bg-white transition-all duration-300 hover:shadow-lg"
                          style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>Utility</span>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/org/${orgId}/project/${selectedProject._id}/calendar`, {
                              state: { userOrgRole: userOrgRole, loggedInUserId: loggedInUserId },
                            })
                          }
                          className="px-4 py-2 rounded-xl font-semibold border-2 bg-white transition-all duration-300 hover:shadow-lg"
                          style={{ color: "#f59e0b", borderColor: "#f59e0b" }}
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Calendar</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Kanban Board - Full Width */}
              {selectedProject ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <KanbanBoard projectId={selectedProject._id} orgId={orgId} onTaskUpdate={handleTaskUpdate} />
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d4b28" }}>
                    No project selected
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Please select a project from the dropdown above to view the Kanban board.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Team View */}
          {activeView === "team" && (
            <div className="space-y-8">
              <TeamMembers members={members} teams={teams} />
              {selectedProject && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                  <ProjectInfo project={selectedProject} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProjectModal && (
        <CreateProjectModal
          orgId={orgId}
          onClose={() => setShowProjectModal(false)}
          onSubmit={handleCreateProject}
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
          currentOrgMembers={members.map((m) => m.user)}
          onInviteSuccess={handleInviteSuccess}
          onInviteError={handleInviteError}
        />
      )}
    </div>
  )
}
