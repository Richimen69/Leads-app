import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

// Spinner mínimo mientras carga la sesión
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-line border-t-toyota rounded-full animate-spin" />
    </div>
  )
}

// Protege cualquier ruta que requiera sesión activa
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user)   return <Navigate to="/login" replace />

  return <Outlet />
}