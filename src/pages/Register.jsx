import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Alert from '../components/Alert'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { name, email, password } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      })
      
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Create Your Account
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Alert message={error} type="error" />
          
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Full Name
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
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
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
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray)',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: 'var(--primary)',
              fontWeight: '500'
            }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}