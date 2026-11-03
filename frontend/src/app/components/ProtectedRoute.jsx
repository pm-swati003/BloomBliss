import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "@/lib/api/hooks/useAuth";
import { useProfile } from "@/lib/api/hooks/useProfile";

export function ProtectedRoute({ children, requireProfileCompletion = false }) {
  const { data: user, isLoading: isUserLoading } = useMe();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isLoading =
    isUserLoading || (requireProfileCompletion && isProfileLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if profile_completed exists either at root or inside user object
  const isProfileCompleted =
    profileData?.profile_completed ??
    profileData?.user?.profile_completed ??
    false;

  if (
    requireProfileCompletion &&
    !isProfileCompleted &&
    location.pathname !== "/complete-profile"
  ) {
    return (
      <Navigate to="/complete-profile" replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
}
