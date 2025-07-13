import { useState } from 'react'
import { FiX, FiUsers, FiFileText } from 'react-icons/fi'
import Alert from '../components/Alert'
import axios from 'axios'

export default function CreateOrgModal({ onClose, onOrgCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { name, description } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const onSubmit = async e => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Organization name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('http://localhost:5000/api/orgs', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      onOrgCreated(res.data.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create organization')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <h2 className="text-xl font-semibold">Create New Organization</h2>
                <p className="text-white/80 text-sm">Set up your team workspace</p>
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
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Organization Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiFileText className="w-4 h-4" />
                Organization Name *
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter organization name..."
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiFileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="4"
                placeholder="Describe your organization's purpose..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5a6f3b]/20 focus:border-[#5a6f3b] transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
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
              onClick={onSubmit}
              disabled={isSubmitting || !name.trim()}
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
                  Create Organization
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}