/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/auth/me').then(({ data }) => { if (active) setUser(data.user) }).catch(() => { if (active) setUser(null) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); setUser(data.user); return data }
  const register = async (details) => { const { data } = await api.post('/auth/register', details); setUser(data.user); return data }
  const logout = async () => { await api.post('/auth/logout'); setUser(null) }
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
