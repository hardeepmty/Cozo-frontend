"use client"

import { useState } from "react"
import { FiX, FiAlertTriangle, FiCalendar, FiUser, FiUsers, FiCheckSquare } from "react-icons/fi"

export default function CreateTaskModal({ onClose, onSubmit, teams, members, projectId, organizationId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    assignedTeam: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError("Task title is required")
      return
    }

    setIsSubmitting(true)
    try {
      const taskDataToSubmit = {
        ...formData,
        project: projectId,
        organization: organizationId,
      }
      await onSubmit(taskDataToSubmit)
    } catch (err) {
      setError("Failed to create task. Please try again.")
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg shadow-2xl border border-white/20 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FiCheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Create New Task</h2>
                <p className="text-white/80 text-sm">Add a new task to your project</p>
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

            {/* Task Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title..."
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
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the task details..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="critical">🔴 Critical Priority</option>
              </select>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}
              >
                Selected: {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Assign to Team */}
            {teams && teams.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Assign to Team
                </label>
                <select
                  name="assignedTeam"
                  value={formData.assignedTeam}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  disabled={isSubmitting}
                >
                  <option value="">Select a team (optional)</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.members?.length || 0} members)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Assign to User */}
            {members && members.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  Assign to User
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  disabled={isSubmitting}
                >
                  <option value="">Select a user (optional)</option>
                  {members.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              disabled={isSubmitting || !formData.title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiCheckSquare className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
