import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute     from './AdminRoute'
import LoginPage from '@/pages/admin/LoginPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Públicas ── */}
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/seguimiento" element={<SeguimientoPage />} />
      {/* ── Admin — requiere sesión + rol admin ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}