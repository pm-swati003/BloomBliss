import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "@/lib/api/hooks/useAuth";

export function AdminRoute({ children }) {
  const { data: user, isLoading } = useMe();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
