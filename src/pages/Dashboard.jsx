"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import OrgCard from "../components/OrgCard"
import ProjectCard from "../components/ProjectCard"
import CreateOrgModal from "./CreateOrgModal"
import JoinOrgModal from "../components/JoinOrgModal"
import Alert from "../components/Alert"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [organizations, setOrganizations] = useState([])
  const [projects, setProjects] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch user data
        const userRes = await axios.get("http://localhost:5000/api/auth/me", config)
        setUser(userRes.data.data)

        // Fetch organizations
        const orgsRes = await axios.get("http://localhost:5000/api/orgs", config)
        setOrganizations(orgsRes.data.data)

        // Fetch projects for each organization
        const allProjects = []
        for (const org of orgsRes.data.data) {
          try {
            const projectsRes = await axios.get(`http://localhost:5000/api/projects/${org._id}`, config)
            allProjects.push(...projectsRes.data.data)
          } catch (err) {
            console.error(`Failed to fetch projects for org ${org._id}:`, err)
          }
        }

        // Sort projects by creation date and get the 3 most recent
        const recentProjects = allProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)

        setProjects(recentProjects)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard data")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

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
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={user} />
        <div className="flex-1 flex items-center justify-center ml-0 md:ml-64">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className="w-16 h-16 border-4 border-opacity-30 rounded-full animate-spin"
                style={{ borderColor: "#5a6f3b", borderTopColor: "#3d4b28" }}
              ></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin animation-delay-150"
                style={{ borderRightColor: "#3b82f6" }}
              ></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4b28" }}>
                Loading Dashboard
              </h3>
              <p className="text-gray-600">Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EEEFE0" }}>
      <Sidebar user={user} />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {error && <Alert message={error} type="error" onClose={() => setError("")} className="mb-8" />}

        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-2 h-12 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
                ></div>
                <div>
                  <h1
                    className="text-4xl md:text-3xl font-bold"
                    style={{
                      background: "linear-gradient(to right, #3d4b28, #5a6f3b, #3d4b28)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Welcome back{user?.name ? `, ${user.name}` : ""}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">Here's what's happening with your projects today.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowJoinModal(true)}
                className="group relative px-6 py-3 bg-white border-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  color: "#5a6f3b",
                  borderColor: "#5a6f3b",
                  boxShadow: "0 4px 6px -1px rgba(90, 111, 59, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#3d4b28"
                  e.target.style.boxShadow = "0 10px 15px -3px rgba(90, 111, 59, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#5a6f3b"
                  e.target.style.boxShadow = "0 4px 6px -1px rgba(90, 111, 59, 0.1)"
                }}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Join Organization</span>
                </div>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(to right, #5a6f3b, #3d4b28)",
                  boxShadow: "0 10px 15px -3px rgba(90, 111, 59, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 20px 25px -5px rgba(90, 111, 59, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 10px 15px -3px rgba(90, 111, 59, 0.3)"
                }}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 transition-transform group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Organization</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
            style={{ boxShadow: "0 10px 15px -3px rgba(90, 111, 59, 0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Organizations</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                  {organizations.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Active workspaces</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(to bottom right, #5a6f3b, #3d4b28)" }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
            style={{ boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Recent Projects</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                  {projects.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Latest updates</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#3b82f6" }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
            style={{ boxShadow: "0 10px 15px -3px rgba(90, 111, 59, 0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Activity</p>
                <p className="text-3xl font-bold mt-1">
                  <span className="flex items-center">
                    <svg
                      className="w-8 h-8 mr-1"
                      style={{ color: "#5a6f3b" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Trending up</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(to bottom right, #3b82f6, #5a6f3b)" }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
              ></div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#3d4b28" }}>
                  Your Organizations
                </h2>
                <p className="text-gray-600">Manage and access your workspaces</p>
              </div>
            </div>
            <div
              className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium border"
              style={{ color: "#5a6f3b", borderColor: "#5a6f3b" }}
            >
              {organizations.length} {organizations.length === 1 ? "organization" : "organizations"}
            </div>
          </div>

          {organizations.length === 0 ? (
            <div
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center"
              style={{ boxShadow: "0 25px 50px -12px rgba(90, 111, 59, 0.15)" }}
            >
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d4b28" }}>
                No organizations yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                You're not part of any organizations yet. Create one or join an existing one to start collaborating with
                your team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-6 py-3 bg-white border-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  style={{ color: "#5a6f3b", borderColor: "#5a6f3b" }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Join Organization</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: "linear-gradient(to right, #5a6f3b, #3d4b28)" }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Organization</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <div key={org._id} className="transform hover:scale-105 transition-all duration-300">
                  <OrgCard org={org} onClick={() => navigate(`/org/${org._id}`)} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #3b82f6, #5a6f3b)" }}
              ></div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#3d4b28" }}>
                  Recent Projects
                </h2>
                <p className="text-gray-600">Your latest project activity</p>
              </div>
            </div>
            <div
              className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium border"
              style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
            >
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </div>
          </div>

          {projects.length === 0 ? (
            <div
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center"
              style={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)" }}
            >
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
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                No projects found. Join or create an organization to start working on exciting projects with your team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="transform hover:scale-105 transition-all duration-300">
                  <ProjectCard
                    project={project}
                    onClick={() => navigate(`/org/${project.organization}/project/${project._id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateOrgModal onClose={() => setShowCreateModal(false)} onOrgCreated={handleOrgCreated} />}
      {showJoinModal && <JoinOrgModal onClose={() => setShowJoinModal(false)} onOrgJoined={handleOrgJoined} />}
    </div>
  )
}
