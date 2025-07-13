"use client"

import { useState } from "react"
import { FiX, FiKey, FiUsers, FiLoader } from "react-icons/fi"
import axios from "axios"

export default function JoinOrgModal({ onClose, onOrgJoined }) {
  const [joinCode, setJoinCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Clear error when user starts typing
  const handleInputChange = (e) => {
    setJoinCode(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!joinCode) {
      setError("Please enter a join code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        "https://cozo-backend.onrender.com/api/orgs/join",
        { joinCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      onOrgJoined(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex-shrink-0 relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5a6f3b] via-[#6b8142] to-[#3d4b28]"></div>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiKey className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Join Organization</h2>
                <p className="text-white/80 text-sm">Enter your invitation code</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              disabled={loading}
            >
              <FiX className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Join Code Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Organization Join Code *</label>
              <div className="relative">
                <input
                  type="text"
                  value={joinCode}
                  onChange={handleInputChange}
                  placeholder="Enter the 6-digit join code"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b]/50 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiUsers className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <span>💡</span>
                <span>Ask an admin of the organization for the join code</span>
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-[#5a6f3b]/5 to-[#3d4b28]/5 backdrop-blur-sm border border-[#5a6f3b]/10 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#5a6f3b]/10 rounded-lg">
                  <FiKey className="w-4 h-4 text-[#5a6f3b]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">How to join</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Enter the 6-digit code provided by your organization admin to join and start collaborating.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end space-x-3 p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !joinCode}
            className="px-6 py-2.5 bg-gradient-to-r from-[#5a6f3b] to-[#3d4b28] text-white rounded-xl hover:from-[#4a5f2b] hover:to-[#2d3b18] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <FiUsers className="w-4 h-4" />
                <span>Join Organization</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
