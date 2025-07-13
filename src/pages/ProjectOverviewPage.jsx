"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import Sidebar from "../components/Sidebar"
import Alert from "../components/Alert"

export default function ProjectOverviewPage() {
  const { orgId, projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Enhanced color palette for charts with Cozo brand integration
  const PIE_CHART_COLORS = ["#5a6f3b", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]
  const BAR_CHART_COLORS = {
    startDate: "#5a6f3b",
    endDate: "#3d4b28",
  }

  useEffect(() => {
    const fetchProjectData = async () => {
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

        // Fetch organization details for sidebar
        const orgRes = await axios.get(`https://cozo-backend.onrender.com/api/orgs/${orgId}`, config)
        setOrg(orgRes.data.data)

        // Fetch project details
        const projectRes = await axios.get(`https://cozo-backend.onrender.com/api/projects/single/${projectId}`, config)
        setProject(projectRes.data.data)

        // Fetch tasks for this project to calculate completion
        const tasksRes = await axios.get(`https://cozo-backend.onrender.com/api/tasks/project/${projectId}`, config)
        setTasks(tasksRes.data.data)
      } catch (err) {
        console.error("Failed to fetch project data:", err)
        setError(err.response?.data?.error || "Failed to load project details.")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else if (err.response?.status === 404) {
          navigate(`/org/${orgId}/projects`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [orgId, projectId, navigate])

  // Data preparation for Charts
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  const pieChartData = Object.keys(taskStatusCounts).map((status) => ({
    name: status.replace(/_/g, " ").toUpperCase(),
    value: taskStatusCounts[status],
  }))

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

  // Display loading state
  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} activePage={`project-${projectId}`} />
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
                Loading Project Overview
              </h3>
              <p className="text-gray-600">Fetching project details and analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Display error or "not found" state
  if (!project) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={org} activePage={`project-${projectId}`} />
        <div className="flex-1 flex justify-center items-center p-8 ml-0 md:ml-64">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center max-w-md">
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
              Project Not Found
            </h3>
            {error ? (
              <Alert message={error} type="error" />
            ) : (
              <p className="text-gray-600 text-lg">The requested project could not be found.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const statusColors = getStatusColor(project.status)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
      <Sidebar user={org} activePage={`project-${projectId}`} />

      <div className="flex-1 ml-0 md:ml-64 p-6">
        {error && <Alert message={error} type="error" className="mb-6" />}

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
            >
              {getInitials(project.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
                ></div>
                <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: "#3d4b28" }}>
                  {project.name}
                </h1>
              </div>
              <p className="text-gray-600 text-lg ml-4">{project.description}</p>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-medium border"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
                borderColor: statusColors.border,
              }}
            >
              {project.status?.replace(/_/g, " ").toUpperCase() || "NO STATUS"}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Tasks</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                    {tasks.length}
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#166534" }}>
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#16a34a" }}
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">In Progress</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#2563eb" }}>
                    {tasks.filter((t) => t.status === "in_progress").length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#3b82f6" }}
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Teams</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#d97706" }}>
                    {project.teams?.length || 0}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
            ></div>
            <h2 className="text-xl font-bold" style={{ color: "#3d4b28" }}>
              Project Details
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#f0f9ff" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#5a6f3b" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">Problem Statement</h3>
                  <p className="text-gray-900">{project.problemStatement || "No problem statement provided"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#f0f9ff" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#3b82f6" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">Created By</h3>
                  <p className="text-gray-900 font-medium">{project.createdBy?.name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#16a34a" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">Start Date</h3>
                  <p className="text-gray-900 font-medium">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fef2f2" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#dc2626" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">End Date</h3>
                  <p className="text-gray-900 font-medium">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#fffbeb" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#d97706" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Assigned Teams</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.teams && project.teams.length > 0 ? (
                      project.teams.map((team) => (
                        <span
                          key={team._id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "#f0f9ff",
                            color: "#3b82f6",
                          }}
                        >
                          {team.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No teams assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Task Completion Pie Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
              ></div>
              <h2 className="text-xl font-bold" style={{ color: "#3d4b28" }}>
                Task Completion Status
              </h2>
            </div>

            {pieChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      className="text-sm font-medium"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#f0f9ff" }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: "#5a6f3b" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#3d4b28" }}>
                    No Tasks Found
                  </h3>
                  <p className="text-gray-600">No tasks found for this project to calculate completion status.</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Timeline */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(to bottom, #3b82f6, #5a6f3b)" }}
              ></div>
              <h2 className="text-xl font-bold" style={{ color: "#3d4b28" }}>
                Project Timeline
              </h2>
            </div>

            {project.startDate || project.endDate ? (
              <div className="h-80">
                <div className="space-y-6">
                  {/* Timeline Visual */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div
                          className="w-4 h-4 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: project.startDate ? "#5a6f3b" : "#e2e8f0" }}
                        ></div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Start Date</p>
                        <p className="text-sm font-semibold" style={{ color: "#3d4b28" }}>
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                        </p>
                      </div>

                      <div className="flex-1 mx-4">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            background:
                              project.startDate && project.endDate
                                ? "linear-gradient(to right, #5a6f3b, #3d4b28)"
                                : "#e2e8f0",
                          }}
                        ></div>
                      </div>

                      <div className="text-center">
                        <div
                          className="w-4 h-4 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: project.endDate ? "#3d4b28" : "#e2e8f0" }}
                        ></div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">End Date</p>
                        <p className="text-sm font-semibold" style={{ color: "#3d4b28" }}>
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Duration Calculation */}
                  {project.startDate && project.endDate && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Project Duration
                        </p>
                        <p className="text-lg font-bold" style={{ color: "#3d4b28" }}>
                          {Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  {project.startDate && project.endDate && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium" style={{ color: "#3d4b28" }}>
                          {(() => {
                            const now = new Date()
                            const start = new Date(project.startDate)
                            const end = new Date(project.endDate)
                            const total = end - start
                            const elapsed = now - start
                            const progress = Math.max(0, Math.min(100, (elapsed / total) * 100))
                            return `${Math.round(progress)}%`
                          })()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            background: "linear-gradient(to right, #5a6f3b, #3d4b28)",
                            width: `${(() => {
                              const now = new Date()
                              const start = new Date(project.startDate)
                              const end = new Date(project.endDate)
                              const total = end - start
                              const elapsed = now - start
                              return Math.max(0, Math.min(100, (elapsed / total) * 100))
                            })()}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#f0f9ff" }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: "#3b82f6" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#3d4b28" }}>
                    No Timeline Set
                  </h3>
                  <p className="text-gray-600">No start or end date specified for this project.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {tasks.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/org/${orgId}/project/${projectId}/tasks`)}
                className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>View All Tasks</span>
                </div>
              </button>

              <button
                onClick={() => navigate(`/org/${orgId}/project/${projectId}`)}
                className="px-6 py-3 rounded-xl font-semibold border-2 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Project Board</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
