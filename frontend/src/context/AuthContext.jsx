import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)   // true while checking session

  // ── On mount: check if already logged in (JWT cookie) ──
  useEffect(() => {
    authApi.me()
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // ── Listen for 401 events from axios interceptor ───────
  useEffect(() => {
    const handler = () => setUser(null)
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [])

  // ── Signup ─────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const data = await authApi.signup(name, email, password)
    setUser(data.user)
    return data.user
  }, [])

  // ── Login ──────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    setUser(data.user)
    return data.user
  }, [])

  // ── Logout ─────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {})
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    signup,
    login,
    logout,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Backwards compat alias
export const useAuthContext = useAuth
