"use client"

import { useState } from "react"
import { FiX, FiFileText, FiCalendar, FiUsers, FiAlertCircle, FiPlus } from "react-icons/fi"

export default function CreateProjectModal({ onClose, onSubmit, teams }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    problemStatement: "",
    teams: [],
    endDate: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleTeamSelect = (teamId) => {
    setFormData((prev) => ({
      ...prev,
      teams: prev.teams.includes(teamId) ? prev.teams.filter((id) => id !== teamId) : [...prev.teams, teamId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.problemStatement) {
      setError("Name and Problem Statement are required")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setError("Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-[#5a6f3b] via-[#6b7c4a] to-[#5a6f3b] p-6 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FiPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                <p className="text-white/80 text-sm">Build something amazing together</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/80 hover:text-white group"
            >
              <FiX className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-red-100 rounded-lg">
                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Project Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="w-4 h-4 text-[#5a6f3b]" />
                Project Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your project name..."
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="w-4 h-4 text-[#5a6f3b]" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your project in a few words..."
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="w-4 h-4 text-[#5a6f3b]" />
                Problem Statement
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                rows="4"
                required
                placeholder="What problem does this project solve? Be specific about the challenges and goals..."
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Teams */}
            {teams && teams.length > 0 && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiUsers className="w-4 h-4 text-[#5a6f3b]" />
                  Assign Teams
                  <span className="text-xs text-gray-500 font-normal">({formData.teams.length} selected)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      onClick={() => handleTeamSelect(team._id)}
                      className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        formData.teams.includes(team._id)
                          ? "border-[#5a6f3b] bg-gradient-to-r from-[#5a6f3b]/5 to-[#6b7c4a]/5 shadow-md"
                          : "border-gray-200 bg-white hover:border-[#5a6f3b]/30 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                            formData.teams.includes(team._id)
                              ? "bg-gradient-to-r from-[#5a6f3b] to-[#6b7c4a] text-white shadow-lg"
                              : "bg-gray-100 text-gray-600 group-hover:bg-[#5a6f3b]/10 group-hover:text-[#5a6f3b]"
                          }`}
                        >
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold truncate transition-colors duration-200 ${
                              formData.teams.includes(team._id) ? "text-[#5a6f3b]" : "text-gray-700"
                            }`}
                          >
                            {team.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{team.members?.length || 0} members</p>
                        </div>
                        {formData.teams.includes(team._id) && (
                          <div className="w-5 h-5 bg-[#5a6f3b] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* End Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiCalendar className="w-4 h-4 text-[#5a6f3b]" />
                Target End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200"
              />
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-gray-200 bg-gray-50/50 p-6 flex-shrink-0">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-[#5a6f3b] to-[#6b7c4a] text-white rounded-xl hover:from-[#4a5f2b] hover:to-[#5b6c3a] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
