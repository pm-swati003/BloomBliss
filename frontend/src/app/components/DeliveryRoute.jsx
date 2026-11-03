import { Navigate, useLocation } from "react-router-dom";
import { useDeliveryMe } from "@/lib/api/hooks/useDelivery";
import { getDeliveryToken } from "@/lib/api/deliveryClient";

export function DeliveryRoute({ children }) {
  const location = useLocation();
  const token = getDeliveryToken();
  const { data: user, isLoading, isError } = useDeliveryMe();

  if (!token) {
    return <Navigate to="/delivery/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (isError || !user || user.role !== "delivery") {
    return <Navigate to="/delivery/login" replace />;
  }

  const profileCompleted = user.profile_completed === true;
  const isProfilePage = location.pathname === "/delivery/profile";
  if (!profileCompleted && !isProfilePage) {
    return (
      <Navigate to="/delivery/profile" replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
}
