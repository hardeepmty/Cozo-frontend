"use client"

import { useState } from "react"
import { FiX, FiUsers, FiCheck, FiAlertTriangle } from "react-icons/fi"

export default function CreateTeamModal({ show, onClose, onSubmit, members }) {
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    members: [],
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setTeamData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleMemberToggle = (memberId) => {
    setTeamData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!teamData.name.trim()) {
      setError("Team name is required")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(teamData)
    } catch (err) {
      setError("Failed to create team. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg shadow-2xl border border-white/20 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Create New Team</h2>
                <p className="text-white/80 text-sm">Build your team and collaborate</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:rotate-90"
              disabled={isSubmitting}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Team Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Team Name *</label>
              <input
                type="text"
                name="name"
                value={teamData.name}
                onChange={handleChange}
                placeholder="Enter team name..."
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={teamData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the team's purpose and goals..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Team Members
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {teamData.members.length} selected
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur-sm">
                {members && members.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {members.map((member) => {
                      const isSelected = teamData.members.includes(member.user._id)
                      return (
                        <div
                          key={member.user._id}
                          onClick={() => handleMemberToggle(member.user._id)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-to-r from-[#5a6f3b]/10 to-[#3d4b28]/10 border border-[#5a6f3b]/20"
                              : "hover:bg-white/80 border border-transparent"
                          }`}
                          disabled={isSubmitting}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a6f3b] to-[#3d4b28] flex items-center justify-center text-white font-semibold text-sm">
                              {member.user.name?.charAt(0)?.toUpperCase() ||
                                member.user.email?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{member.user.name || "Unknown User"}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                              {member.role && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {member.role}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          <div className="flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#5a6f3b] border-[#5a6f3b] scale-110"
                                  : "border-gray-300 hover:border-[#5a6f3b]"
                              }`}
                            >
                              {isSelected && <FiCheck className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No members available</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex-shrink-0 bg-gray-50/80 backdrop-blur-sm px-6 py-4 rounded-b-2xl border-t border-gray-200/50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !teamData.name.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiUsers className="w-4 h-4" />
                  Create Team
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
