import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "@/pages/LoginPage";
import SeguimientoPage from "@/pages/SeguimientoPage";

import DashboardPage from "@/pages/admin/DashboardPage";
import ProspectosPage from "@/pages/admin/ProspectosPage";
import AsesoresPage from "@/pages/admin/AsesoresPage";
import { useAuth } from "@/features/auth/context/AuthContext";

function RootRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      {/* ── Públicas ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/seguimiento" element={<SeguimientoPage />} />

      {/* ── Admin — requiere sesión + rol admin ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/prospectos" element={<ProspectosPage />} />
          <Route path="/admin/asesores" element={<AsesoresPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
