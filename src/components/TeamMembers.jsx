"use client"

import { useState } from "react"

export default function TeamMembers({ members, teams }) {
  const [activeView, setActiveView] = useState(null)
  const [animating, setAnimating] = useState(false)

  const handleViewChange = (view) => {
    if (activeView === view) {
      setActiveView(null)
      return
    }

    setAnimating(true)
    setTimeout(() => {
      setActiveView(view)
      setAnimating(false)
    }, 300)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div
            className="w-2 h-12 rounded-full"
            style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
          ></div>
          <h2 className="text-3xl font-bold" style={{ color: "#3d4b28" }}>
            Team & Members
          </h2>
        </div>
        <p className="text-gray-600 text-lg">Click the buttons below to explore your team</p>
      </div>

      {/* Central Control Hub */}
      <div className="flex justify-center items-center space-x-12 mb-16">
        {/* Members Button */}
        <div className="relative">
          <button
            onClick={() => handleViewChange("members")}
            className={`group relative w-32 h-32 rounded-full shadow-2xl transition-all duration-500 transform ${
              activeView === "members"
                ? "scale-110 shadow-green-300"
                : "hover:scale-105 hover:shadow-xl active:scale-95"
            }`}
            style={{
              background:
                activeView === "members"
                  ? "linear-gradient(135deg, #5a6f3b, #3d4b28)"
                  : "linear-gradient(135deg, #ffffff, #f8fafc)",
              border: activeView === "members" ? "4px solid #5a6f3b" : "4px solid #e2e8f0",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className={`w-8 h-8 mb-2 transition-colors duration-300 ${
                  activeView === "members" ? "text-white" : "text-gray-600 group-hover:text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span
                className={`text-sm font-bold transition-colors duration-300 ${
                  activeView === "members" ? "text-white" : "text-gray-700 group-hover:text-green-600"
                }`}
              >
                Members
              </span>
              <span
                className={`text-xs transition-colors duration-300 ${
                  activeView === "members" ? "text-green-100" : "text-gray-500"
                }`}
              >
                {members?.length || 0}
              </span>
            </div>

            {/* Ripple Effect */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                activeView === "members" ? "animate-ping" : ""
              }`}
              style={{
                background: "radial-gradient(circle, rgba(90, 111, 59, 0.3) 0%, transparent 70%)",
                animationDuration: "2s",
              }}
            ></div>
          </button>

          {/* Member Count Badge */}
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#5a6f3b" }}
          >
            {members?.length || 0}
          </div>
        </div>

        {/* Teams Button */}
        <div className="relative">
          <button
            onClick={() => handleViewChange("teams")}
            className={`group relative w-32 h-32 rounded-full shadow-2xl transition-all duration-500 transform ${
              activeView === "teams" ? "scale-110 shadow-blue-300" : "hover:scale-105 hover:shadow-xl active:scale-95"
            }`}
            style={{
              background:
                activeView === "teams"
                  ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                  : "linear-gradient(135deg, #ffffff, #f8fafc)",
              border: activeView === "teams" ? "4px solid #3b82f6" : "4px solid #e2e8f0",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                className={`w-8 h-8 mb-2 transition-colors duration-300 ${
                  activeView === "teams" ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                }`}
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
              <span
                className={`text-sm font-bold transition-colors duration-300 ${
                  activeView === "teams" ? "text-white" : "text-gray-700 group-hover:text-blue-600"
                }`}
              >
                Teams
              </span>
              <span
                className={`text-xs transition-colors duration-300 ${
                  activeView === "teams" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {teams?.length || 0}
              </span>
            </div>

            {/* Ripple Effect */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                activeView === "teams" ? "animate-ping" : ""
              }`}
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                animationDuration: "2s",
              }}
            ></div>
          </button>

          {/* Team Count Badge */}
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#3b82f6" }}
          >
            {teams?.length || 0}
          </div>
        </div>
      </div>

      {/* Animated Content Area */}
      <div className="relative min-h-96">
        {/* Members View */}
        {activeView === "members" && (
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {members?.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#f0f9ff" }}
                >
                  <svg
                    className="w-12 h-12"
                    style={{ color: "#5a6f3b" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4b28" }}>
                  No Members Yet
                </h3>
                <p className="text-gray-600">Invite team members to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, index) => (
                  <div
                    key={member.user._id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                    style={{
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                      boxShadow: "0 10px 25px rgba(90, 111, 59, 0.1)",
                    }}
                  >
                    {/* Avatar */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, #5a6f3b, #3d4b28)`,
                        }}
                      >
                        {getInitials(member.user.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "#3d4b28" }}>
                          {member.user.name}
                        </h3>
                        <div
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: member.role === "admin" ? "#dcfce7" : "#f1f5f9",
                            color: member.role === "admin" ? "#166534" : "#334155",
                          }}
                        >
                          {member.role?.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
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
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Email</span>
                        </div>
                      </button>
                      <button
                        className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: "#f0f9ff",
                          color: "#3b82f6",
                          border: "2px solid #3b82f6",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#3b82f6"
                          e.target.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#f0f9ff"
                          e.target.style.color = "#3b82f6"
                        }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>Call</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teams View */}
        {activeView === "teams" && (
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {teams?.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#eff6ff" }}
                >
                  <svg
                    className="w-12 h-12"
                    style={{ color: "#3b82f6" }}
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
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#1d4ed8" }}>
                  No Teams Yet
                </h3>
                <p className="text-gray-600">Create teams to organize your members!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team, index) => (
                  <div
                    key={team._id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    style={{
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    {/* Team Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        }}
                      >
                        {getInitials(team.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "#1d4ed8" }}>
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-600">{team.description || "No description"}</p>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="flex items-center justify-between">
                      <div
                        className="px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                        }}
                      >
                        {team.members?.length || 0} Members
                      </div>
                      <button
                        className="p-2 rounded-full transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Welcome State */}
        {!activeView && (
          <div className="text-center py-16">
            <div className="mb-8">
              <div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #ecebe1, #f8fafc)" }}
              >
                <svg
                  className="w-16 h-16"
                  style={{ color: "#5a6f3b" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#3d4b28" }}>
                Welcome to Your Team Hub
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Click on the circular buttons above to explore your team members and organized teams with beautiful
                animations!
              </p>
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
      `}</style>
    </div>
  )
}
