import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-line border-t-toyota rounded-full animate-spin" />
    </div>
  );
}

export default function AdminRoute() {
  const { role, loading } = useAuth();

  console.log("ADMIN ROLE:", role);
  console.log("ADMIN LOADING:", loading);

  if (loading || role === null) {
    return <LoadingScreen />;
  }

  if (role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}