"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Alert from "../components/Alert"

export default function ProjectUtilityPage() {
  const { orgId, projectId } = useParams()
  const navigate = useNavigate()
  const [utilityItems, setUtilityItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [itemName, setItemName] = useState("")
  const [itemValue, setItemValue] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [currentOrg, setCurrentOrg] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }
        const config = { headers: { Authorization: `Bearer ${token}` } }

        // Fetch project details
        const projectRes = await axios.get(`https://cozo-backend.onrender.com/api/projects/single/${projectId}`, config)
        setCurrentProject(projectRes.data.data)

        // Fetch organization details
        const orgRes = await axios.get(`https://cozo-backend.onrender.com/api/orgs/${orgId}`, config)
        setCurrentOrg(orgRes.data.data)

        // Fetch utility items for this project
        const itemsRes = await axios.get(`https://cozo-backend.onrender.com/api/utility-items/project/${projectId}`, config)
        setUtilityItems(itemsRes.data.data)
      } catch (err) {
        console.error("Failed to fetch utility data:", err)
        setError(err.response?.data?.error || "Failed to load utility items.")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUtilityData()
  }, [projectId, orgId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName.trim() || !itemValue.trim()) {
      setError("Name and Value cannot be empty.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (editingItem) {
        // Update existing item
        const res = await axios.put(
          `https://cozo-backend.onrender.com/api/utility-items/${editingItem._id}`,
          { name: itemName, value: itemValue },
          config,
        )
        setUtilityItems(utilityItems.map((item) => (item._id === editingItem._id ? res.data.data : item)))
        setEditingItem(null)
      } else {
        // Create new item
        const res = await axios.post(
          "https://cozo-backend.onrender.com/api/utility-items",
          { name: itemName, value: itemValue, project: projectId },
          config,
        )
        setUtilityItems([...utilityItems, res.data.data])
      }
      setItemName("")
      setItemValue("")
      setError("")
    } catch (err) {
      console.error("Failed to save utility item:", err)
      setError(err.response?.data?.error || "Failed to save utility item.")
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`https://cozo-backend.onrender.com/api/utility-items/${itemToDelete._id}`, config)
      setUtilityItems(utilityItems.filter((item) => item._id !== itemToDelete._id))
      setError("")
    } catch (err) {
      console.error("Failed to delete utility item:", err)
      setError(err.response?.data?.error || "Failed to delete utility item.")
    } finally {
      setShowDeleteModal(false)
      setItemToDelete(null)
    }
  }

  const handleEditClick = (item) => {
    setEditingItem(item)
    setItemName(item.name)
    setItemValue(item.value)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setItemName("")
    setItemValue("")
    setError("")
  }

  const getItemIcon = (name, value) => {
    const lowerName = name.toLowerCase()
    const lowerValue = value.toLowerCase()

    if (lowerName.includes("figma") || lowerValue.includes("figma")) {
      return (
        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V8.981H8.148z" />
        </svg>
      )
    }

    if (lowerName.includes("password") || lowerName.includes("key") || lowerName.includes("secret")) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      )
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      )
    }

    return (
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    )
  }

  const getItemType = (name, value) => {
    const lowerName = name.toLowerCase()
    const lowerValue = value.toLowerCase()

    if (lowerName.includes("figma") || lowerValue.includes("figma")) {
      return { label: "Design", color: "#8b5cf6", bg: "#f3e8ff" }
    }
    if (lowerName.includes("password") || lowerName.includes("key") || lowerName.includes("secret")) {
      return { label: "Credential", color: "#dc2626", bg: "#fef2f2" }
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return { label: "Link", color: "#2563eb", bg: "#eff6ff" }
    }
    return { label: "Text", color: "#6b7280", bg: "#f9fafb" }
  }

  const filteredItems = utilityItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: "#ecebe1" }}>
        <Sidebar user={currentOrg} activePage="utility" />
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
                Loading Utility Data
              </h3>
              <p className="text-gray-600">Fetching project resources...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ecebe1" }}>
      <Sidebar user={currentOrg} activePage="utility" />

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
                Project Utilities
              </h1>
              <p className="text-gray-600 text-lg">
                {currentProject?.name ? `${currentProject.name} Resources` : "Project Resources & Links"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Items</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#3d4b28" }}>
                    {utilityItems.length}
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Links</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#2563eb" }}>
                    {utilityItems.filter((item) => item.value.startsWith("http")).length}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Credentials</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#dc2626" }}>
                    {
                      utilityItems.filter(
                        (item) =>
                          item.name.toLowerCase().includes("password") ||
                          item.name.toLowerCase().includes("key") ||
                          item.name.toLowerCase().includes("secret"),
                      ).length
                    }
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Design Files</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#8b5cf6" }}>
                    {
                      utilityItems.filter(
                        (item) =>
                          item.name.toLowerCase().includes("figma") || item.value.toLowerCase().includes("figma"),
                      ).length
                    }
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#8b5cf6" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v12a2 2 0 002 2 2 2 0 002-2V3zM21 3h-6a2 2 0 00-2 2v4a2 2 0 002 2h6V3zM21 13h-6a2 2 0 00-2 2v4a2 2 0 002 2h6v-8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
            ></div>
            <h2 className="text-xl font-bold" style={{ color: "#3d4b28" }}>
              {editingItem ? "Edit Utility Item" : "Add New Utility Item"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#3d4b28" }}>
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Figma Design, Admin Password, API Key"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    borderColor: "#e2e8f0",
                    focusBorderColor: "#5a6f3b",
                    focusRingColor: "#5a6f3b",
                  }}
                  aria-label="Item Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#3d4b28" }}>
                  Item Value
                </label>
                <input
                  type="text"
                  placeholder="e.g., https://figma.com/file/..., MySecretPassword123"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    borderColor: "#e2e8f0",
                    focusBorderColor: "#5a6f3b",
                    focusRingColor: "#5a6f3b",
                  }}
                  aria-label="Item Value"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #5a6f3b, #3d4b28)" }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        editingItem
                          ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          : "M12 4v16m8-8H4"
                      }
                    />
                  </svg>
                  <span>{editingItem ? "Update Item" : "Add Item"}</span>
                </div>
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 rounded-xl font-semibold border-2 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ color: "#6b7280", borderColor: "#6b7280" }}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </div>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="relative max-w-md">
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
              placeholder="Search utility items..."
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
        </div>

        {/* Utility Items Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
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
                {searchTerm ? "No matching items" : "No utility items yet"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Add your first utility item to store important project links, credentials, and resources."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: "#f8fafc" }}>
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>Item Details</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Value</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                          />
                        </svg>
                        <span>Type</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#3d4b28" }}
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item, index) => {
                    const itemType = getItemType(item.name, item.value)
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                        style={{
                          animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">{getItemIcon(item.name, item.value)}</div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                Added {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {item.value.startsWith("http://") || item.value.startsWith("https://") ? (
                              <a
                                href={item.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline break-all"
                              >
                                {item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value}
                              </a>
                            ) : (
                              <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded-lg break-all">
                                {item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: itemType.bg,
                              color: itemType.color,
                            }}
                          >
                            {itemType.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                              style={{
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#2563eb"
                                e.target.style.color = "white"
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#eff6ff"
                                e.target.style.color = "#2563eb"
                              }}
                              aria-label={`Edit ${item.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                              style={{
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#dc2626"
                                e.target.style.color = "white"
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#fef2f2"
                                e.target.style.color = "#dc2626"
                              }}
                              aria-label={`Delete ${item.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Utility Item</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>"{itemToDelete?.name}"</strong>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium border-2 bg-white transition-all duration-300"
                  style={{ color: "#6b7280", borderColor: "#6b7280" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all duration-300"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
