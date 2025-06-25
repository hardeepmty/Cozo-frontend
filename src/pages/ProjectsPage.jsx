"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import Alert from "../components/Alert"

export default function ProjectsPage() {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const [org, setOrg] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or table
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        // Fetch organization details
        const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config)
        setOrg(orgRes.data.data)

        const projectsRes = await axios.get(`http://localhost:5000/api/projects/${orgId}`, config)
        setProjects(projectsRes.data.data)
      } catch (err) {
        console.error("Failed to fetch projects data:", err)
        setError(err.response?.data?.error || "Failed to load projects.")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjectsData()
  }, [orgId, navigate])

  // Filter projects based on search and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in_progress":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" }
      case "completed":
        return { bg: "#f0f9ff", text: "#1e40af", border: "#bfdbfe" }
      case "on_hold":
        return { bg: "#fffbeb", text: "#d97706", border: "#fed7aa" }
      case "cancelled":
        return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" }
      default:
        return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" }
    }
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "P"
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} activePage="projects" />
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
                Loading Projects
              </h3>
              <p className="text-gray-600">Fetching your project data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
      <Sidebar user={org} activePage="projects" />

      <div className="flex-1 ml-0 md:ml-64 p-6">
        {error && <Alert message={error} type="error" className="mb-6" />}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-2 h-12 rounded-full"
              style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
            ></div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: "#3d4b28" }}>
                Projects
              </h1>
              <p className="text-gray-600 text-lg">
                {org?.name ? `${org.name} Organization` : "Organization Projects"}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Projects</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                    {projects.length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#166534" }}>
                    {projects.filter((p) => p.status === "active" || p.status === "in_progress").length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#1e40af" }}>
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">On Hold</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#d97706" }}>
                    {projects.filter((p) => p.status === "on_hold").length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#f59e0b" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "#e2e8f0",
                      focusBorderColor: "#5a6f3b",
                      focusRingColor: "#5a6f3b",
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    borderColor: "#e2e8f0",
                    focusBorderColor: "#5a6f3b",
                    focusRingColor: "#5a6f3b",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    viewMode === "grid" ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-800"
                  }`}
                  style={{
                    background: viewMode === "grid" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    viewMode === "table" ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-800"
                  }`}
                  style={{
                    background: viewMode === "table" ? "linear-gradient(135deg, #5a6f3b, #3d4b28)" : "transparent",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d4b28" }}>
              {searchTerm || statusFilter !== "all" ? "No matching projects" : "No projects found"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No projects have been created for this organization yet. Contact an admin to create the first project."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const statusColors = getStatusColor(project.status)
              return (
                <div
                  key={project._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  onClick={() => navigate(`/org/${orgId}/project/${project._id}`)}
                >
                  {/* Project Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                      style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                    >
                      {getInitials(project.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold line-clamp-1" style={{ color: "#3d4b28" }}>
                        {project.name || "Untitled Project"}
                      </h3>
                      <div
                        className="px-2 py-1 rounded-md text-xs font-medium border inline-block"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          borderColor: statusColors.border,
                        }}
                      >
                        {project.status?.replace(/_/g, " ").toUpperCase() || "NO STATUS"}
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description || "No description available"}</p>

                  {/* Project Details */}
                  <div className="space-y-3">
                    {project.problemStatement && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Problem Statement
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">{project.problemStatement}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created By</p>
                        <p className="text-gray-700">{project.createdBy?.name || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Date</p>
                        <p className="text-gray-700">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                        </p>
                      </div>
                    </div>

                    {project.teams && project.teams.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Teams</p>
                        <div className="flex flex-wrap gap-1">
                          {project.teams.slice(0, 3).map((team) => (
                            <span
                              key={team._id}
                              className="px-2 py-1 rounded-md text-xs font-medium"
                              style={{
                                backgroundColor: "#f0f9ff",
                                color: "#3b82f6",
                              }}
                            >
                              {team.name}
                            </span>
                          ))}
                          {project.teams.length > 3 && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              +{project.teams.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      className="w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: "#f0f9ff",
                        color: "#5a6f3b",
                        border: "2px solid #5a6f3b",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#5a6f3b"
                        e.target.style.color = "white"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#f0f9ff"
                        e.target.style.color = "#5a6f3b"
                      }}
                    >
                      View Project →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Project
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Created By
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Dates
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Teams
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const statusColors = getStatusColor(project.status)
                    return (
                      <tr key={project._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                              style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
                            >
                              {getInitials(project.name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{project.name || "Untitled"}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {project.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium border inline-block"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              borderColor: statusColors.border,
                            }}
                          >
                            {project.status?.replace(/_/g, " ").toUpperCase() || "NO STATUS"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{project.createdBy?.name || "Unknown"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div>
                            <p>
                              Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                            </p>
                            <p>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {project.teams && project.teams.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {project.teams.slice(0, 2).map((team) => (
                                <span
                                  key={team._id}
                                  className="px-2 py-1 rounded-md text-xs font-medium"
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    color: "#3b82f6",
                                  }}
                                >
                                  {team.name}
                                </span>
                              ))}
                              {project.teams.length > 2 && (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                  +{project.teams.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No teams</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/org/${orgId}/project/${project._id}`)}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                            style={{
                              backgroundColor: "#f0f9ff",
                              color: "#5a6f3b",
                              border: "1px solid #5a6f3b",
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
