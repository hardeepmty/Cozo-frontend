"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FiX, FiSearch, FiUserPlus, FiUsers, FiCheck, FiAlertTriangle } from "react-icons/fi"

export default function InviteUsersModal({ show, onClose, orgId, currentOrgMembers, onInviteSuccess, onInviteError }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [allPlatformUsers, setAllPlatformUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [sendingInvites, setSendingInvites] = useState(false)
  const [modalError, setModalError] = useState("")

  // Clear error when user starts typing
  useEffect(() => {
    if (modalError && (searchTerm || selectedUserIds.length > 0)) {
      setModalError("")
    }
  }, [searchTerm, selectedUserIds, modalError])

  // Fetch all platform users when the modal becomes visible
  useEffect(() => {
    if (show && orgId) {
      const fetchPlatformUsers = async () => {
        setLoadingUsers(true)
        setModalError("")
        try {
          const token = localStorage.getItem("token")
          const config = { headers: { Authorization: `Bearer ${token}` } }
          const usersRes = await axios.get("http://localhost:5000/api/auth/users", config)
          setAllPlatformUsers(usersRes.data.data)
        } catch (err) {
          console.error("Failed to fetch platform users:", err)
          setModalError(err.response?.data?.error || "Failed to load users for invitation.")
        } finally {
          setLoadingUsers(false)
        }
      }
      fetchPlatformUsers()
    }
  }, [show, orgId])

  // Reset selected users and search term when modal is closed
  useEffect(() => {
    if (!show) {
      setSearchTerm("")
      setSelectedUserIds([])
      setModalError("")
    }
  }, [show])

  // Filter out users who are already members of the current organization
  const nonOrgMembers = allPlatformUsers.filter((user) => !currentOrgMembers.some((member) => member._id === user._id))

  const filteredUsers = nonOrgMembers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedUserIds.length === 0) {
      setModalError("Please select at least one user to invite.")
      return
    }

    setSendingInvites(true)
    setModalError("")
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const selectedUserEmails = allPlatformUsers
        .filter((user) => selectedUserIds.includes(user._id))
        .map((user) => user.email)

      if (selectedUserEmails.length === 0) {
        setModalError("Could not retrieve emails for selected users. Please try again.")
        setSendingInvites(false)
        return
      }

      const res = await axios.post(
        `http://localhost:5000/api/orgs/${orgId}/invite`,
        { emails: selectedUserEmails },
        config,
      )

      console.log("Invite sent response:", res.data)
      onInviteSuccess(res.data.message || "Invitations sent successfully!")
    } catch (err) {
      console.error("Failed to send invitations:", err)
      const errorMessage = err.response?.data?.error || "Failed to send invitations."
      setModalError(errorMessage)
      onInviteError(errorMessage)
    } finally {
      setSendingInvites(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiUserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invite Users</h2>
                <p className="text-white/80 text-sm">Add new members to your organization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              disabled={sendingInvites}
            >
              <FiX className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 space-y-6">
            {/* Error Alert */}
            {modalError && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
                <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{modalError}</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 placeholder-gray-500"
                disabled={loadingUsers}
              />
              {loadingUsers && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="w-5 h-5 border-2 border-[#5a6f3b]/20 border-t-[#5a6f3b] rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Selected Count */}
            {selectedUserIds.length > 0 && (
              <div className="bg-gradient-to-r from-[#5a6f3b]/10 to-[#3d4b28]/10 backdrop-blur-sm border border-[#5a6f3b]/20 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <FiUsers className="w-5 h-5 text-[#5a6f3b]" />
                  <span className="text-[#5a6f3b] font-medium">
                    {selectedUserIds.length} user{selectedUserIds.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-2">
              {loadingUsers ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    {searchTerm ? "No matching users found" : "All users are already members"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Everyone on the platform is already part of this organization"}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user._id)
                  return (
                    <div
                      key={user._id}
                      onClick={() => !sendingInvites && handleCheckboxChange(user._id)}
                      className={`
                        relative bg-white/50 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                        ${
                          isSelected
                            ? "border-[#5a6f3b] bg-gradient-to-r from-[#5a6f3b]/10 to-[#3d4b28]/10 shadow-md"
                            : "border-gray-200 hover:border-[#5a6f3b]/30"
                        }
                        ${sendingInvites ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div
                          className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-200
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-[#5a6f3b] to-[#3d4b28] scale-110"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          }
                        `}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Selection Indicator */}
                        <div
                          className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                          ${isSelected ? "border-[#5a6f3b] bg-[#5a6f3b] scale-110" : "border-gray-300"}
                        `}
                        >
                          {isSelected && <FiCheck className="w-4 h-4 text-white animate-in zoom-in duration-200" />}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={sendingInvites}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={selectedUserIds.length === 0 || sendingInvites}
              className="px-6 py-3 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white rounded-xl font-medium hover:from-[#4a5f2b] hover:to-[#2d3b18] focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sendingInvites ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="w-4 h-4" />
                  <span>Send Invite ({selectedUserIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
