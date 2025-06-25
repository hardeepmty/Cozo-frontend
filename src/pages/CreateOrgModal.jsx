import { useState } from 'react'
import axios from 'axios'
import Alert from '../components/Alert'

export default function CreateOrgModal({ onClose, onOrgCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { name, description } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('http://localhost:5000/api/orgs', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      onOrgCreated(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create organization')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create New Organization</h2>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              opacity: 0.5,
              ':hover': {
                opacity: 1
              }
            }}
          >
          </button>
        </div>

        <Alert message={error} type="error" />

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Organization Name *
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--gray)',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--gray)',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '1px solid var(--gray)',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}