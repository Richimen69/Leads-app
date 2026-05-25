import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "@/pages/LoginPage";
import SeguimientoPage from "@/pages/SeguimientoPage";

import DashboardPage from "@/pages/admin/DashboardPage";
import ProspectosPage from "@/pages/admin/ProspectosPage";
import AsesoresPage from "@/pages/admin/AsesoresPage";

export default function AppRouter() {
  return (
    <Routes>
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
