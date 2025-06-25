"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const statusColumns = [
  { id: "to_do", title: "To Do", color: "#64748b", bgColor: "#f1f5f9" },
  { id: "in_progress", title: "In Progress", color: "#3b82f6", bgColor: "#eff6ff" },
  { id: "under_review", title: "Review", color: "#f59e0b", bgColor: "#fffbeb" },
  { id: "completed", title: "Completed", color: "#5a6f3b", bgColor: "#f0f9ff" },
]

export default function KanbanBoard({ projectId, onTaskUpdate }) {
  const [tasks, setTasks] = useState([])
  const [userTasks, setUserTasks] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        // Fetch current user data
        const userRes = await axios.get("http://localhost:5000/api/auth/me", config)
        setCurrentUser(userRes.data.data)

        // Fetch all project tasks
        const tasksRes = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, config)
        setTasks(tasksRes.data.data)

        // Fetch user's tasks
        const myTasksRes = await axios.get("http://localhost:5000/api/tasks/my-tasks", config)
        setUserTasks(myTasksRes.data.data.map((task) => task._id))
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchData()
    }
  }, [projectId])

  // Check if task belongs to current user
  const isUserTask = (taskId) => userTasks.includes(taskId)

  // Check if task can be dragged
  const canDragTask = (task) => {
    if (!currentUser) return false

    return (
      isUserTask(task._id) || // User's personal task
      (task.assignedTeam && currentUser.teams?.includes(task.assignedTeam._id)) || // User is in assigned team
      currentUser.role === "admin" // User is admin
    )
  }

  const handleDragStart = (e, task) => {
    if (canDragTask(task)) {
      setDraggedTask(task)
      e.dataTransfer.setData("taskId", task._id)
      e.dataTransfer.effectAllowed = "move"
    } else {
      e.preventDefault()
    }
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    setDragOverColumn(null)

    const taskId = e.dataTransfer.getData("taskId")
    if (!taskId) return

    const taskToUpdate = tasks.find((task) => task._id === taskId)
    if (!taskToUpdate || taskToUpdate.status === newStatus) return

    try {
      // Optimistic UI update
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)))

      await onTaskUpdate(taskId, newStatus)
    } catch (err) {
      setError("Failed to update task status")
      setTasks(tasks) // Revert on error
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" }
      case "medium":
        return { bg: "#fffbeb", text: "#d97706", border: "#fed7aa" }
      case "low":
        return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" }
      default:
        return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 rounded-2xl" style={{ backgroundColor: "#ecebe1" }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div
              className="w-12 h-12 border-4 border-opacity-30 rounded-full animate-spin"
              style={{ borderColor: "#5a6f3b", borderTopColor: "#3d4b28" }}
            ></div>
          </div>
          <p className="text-lg font-medium" style={{ color: "#3d4b28" }}>
            Loading tasks...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border-l-4 bg-red-50" style={{ borderLeftColor: "#dc2626" }}>
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: "linear-gradient(to bottom, #5a6f3b, #3d4b28)" }}
          ></div>
          <h2 className="text-2xl font-bold" style={{ color: "#3d4b28" }}>
            Project Board
          </h2>
        </div>
        <p className="text-gray-600 ml-4">Drag and drop tasks to update their status</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-96">
        {statusColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)
          const isDropZone = dragOverColumn === column.id

          return (
            <div
              key={column.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-300 ${
                isDropZone ? "ring-2 ring-offset-2 scale-105" : ""
              }`}
              style={{
                borderColor: column.color,
                ringColor: isDropZone ? column.color : "transparent",
                boxShadow: isDropZone ? `0 25px 50px -12px ${column.color}40` : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-6 rounded-t-2xl" style={{ backgroundColor: column.bgColor }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold" style={{ color: column.color }}>
                    {column.title}
                  </h3>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: column.color,
                      color: "white",
                    }}
                  >
                    {columnTasks.length}
                  </div>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="p-4 space-y-4 min-h-80">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: column.bgColor }}
                    >
                      <svg
                        className="w-8 h-8"
                        style={{ color: column.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No tasks yet</p>
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const priorityColors = getPriorityColor(task.priority)
                    const isMyTask = isUserTask(task._id)
                    const isDraggable = canDragTask(task)
                    const isBeingDragged = draggedTask?._id === task._id

                    return (
                      <div
                        key={task._id}
                        draggable={isDraggable}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`relative bg-white rounded-xl shadow-md border transition-all duration-300 ${
                          isDraggable ? "hover:shadow-lg hover:-translate-y-1 cursor-grab active:cursor-grabbing" : ""
                        } ${isBeingDragged ? "opacity-50 scale-95" : ""}`}
                        style={{
                          borderColor: isMyTask ? "#5a6f3b" : "#e2e8f0",
                          borderWidth: isMyTask ? "2px" : "1px",
                          backgroundColor: isMyTask ? "#f0f9ff" : "white",
                        }}
                      >
                        {/* User Task Indicator */}
                        {isMyTask && (
                          <div
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                            style={{ backgroundColor: "#5a6f3b" }}
                          >
                            ✓
                          </div>
                        )}

                        <div className="p-4">
                          {/* Task Title */}
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h4>

                          {/* Task Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {task.description?.substring(0, 100)}
                            {task.description?.length > 100 ? "..." : ""}
                          </p>

                          {/* Task Meta */}
                          <div className="space-y-3">
                            {/* Due Date */}
                            {task.dueDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}

                            {/* Priority Badge */}
                            <div className="flex items-center justify-between">
                              <div
                                className="px-2 py-1 rounded-md text-xs font-medium border"
                                style={{
                                  backgroundColor: priorityColors.bg,
                                  color: priorityColors.text,
                                  borderColor: priorityColors.border,
                                }}
                              >
                                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                              </div>

                              {/* Assigned Team */}
                              {task.assignedTeam && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                  Team
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Drag Handle */}
                        {isDraggable && (
                          <div className="absolute top-2 right-2 opacity-30 hover:opacity-60 transition-opacity">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#3d4b28" }}>
          Legend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded border-2"
              style={{ backgroundColor: "#f0f9ff", borderColor: "#5a6f3b" }}
            ></div>
            <span className="text-gray-700">Your personal tasks</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
            <span className="text-gray-700">Draggable tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}
