import React from 'react'
import '../auth.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const navigate = useNavigate()
  const { user, loading, handleRegister, authError, setAuthError } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setAuthError('')

    const result = await handleRegister({ username, email, password })

    if (result?.success) {
      navigate('/')
      return
    }

    setError(result?.error || result?.message || authError || 'Registration failed')
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="34" height="34" fill="#0d1117" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 0 1 8 3.52c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </div>

        <h1 className="auth-title">Sign up to MultiGit</h1>

        {(error || authError) && (
          <p className="auth-error" role="alert" aria-live="polite">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error || authError}</span>
          </p>
        )}

        <form className="auth-card" aria-label="Sign up form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field-group">
            <label htmlFor="register-username" className="auth-label">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              className="auth-input"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
                setAuthError('')
              }}
              autoComplete="username"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="auth-field-group">
            <label htmlFor="register-email" className="auth-label">
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              className="auth-input"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
                setAuthError('')
              }}
              autoComplete="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="auth-field-group">
            <label htmlFor="register-password" className="auth-label">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="auth-input"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
                setAuthError('')
              }}
              autoComplete="new-password"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="auth-button auth-button-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Signup'}
          </button>
        </form>

        <section className="auth-footer-card">
          Already have an account? <Link to="/login" className="auth-footer-link">Sign In</Link>
        </section>
      </section>
    </main>
  )
}

export default Register