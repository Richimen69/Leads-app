import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

// Solo permite acceso si el rol es 'admin'
export default function AdminRoute() {
  const { role, loading } = useAuth()

  if (loading)           return null
  if (role === 'admin')  return <Outlet />

  return <Navigate to="/login" replace />
}