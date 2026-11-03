import { Link } from "react-router-dom";
import { User, LogOut, AlertCircle } from "lucide-react";
import { useDeliveryProfileLogic } from "./hooks/useDeliveryProfileLogic";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { VehicleInfoForm } from "./components/VehicleInfoForm";
import { ProfileDetails } from "./components/ProfileDetails";
import { AvailabilitySettings } from "./components/AvailabilitySettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { PerformanceStats } from "./components/PerformanceStats";
import { deliveryLogout } from "@/lib/api/hooks/useDelivery";

export function DeliveryProfile() {
  const {
    availability,
    setAvailability,
    notifications,
    setNotifications,
    isEditing,
    setIsEditing,
    form,
    setForm,
    touched,
    setTouched,
    user,
    userLoading,
    updateProfile,
    totalDeliveries,
    completedToday,
    pending,
    totalEarnings,
    completionRate,
    profileCompleted,
    nameValid,
    phoneValid,
    vehicleValid,
    canSave,
    handleSubmit,
    handleFileChange,
    displayName,
    joinDate,
    REQUIRED_MESSAGE,
  } = useDeliveryProfileLogic();

  if (userLoading && !user) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p className="text-[#6B7280] font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center relative shadow-inner">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-white mb-2 text-3xl font-bold font-sans">{displayName}</h1>
                <p className="text-white/90 font-medium">Delivery Partner</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/delivery/dashboard"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={deliveryLogout}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 flex items-center gap-2 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" /> Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!profileCompleted && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Complete your profile</p>
              <p className="text-sm text-amber-800 mt-1">
                Please fill in all required fields below. You need to complete your profile before you can access the dashboard and receive deliveries.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {!isEditing ? (
              <ProfileDetails user={user} onEdit={() => setIsEditing(true)} />
            ) : (
              <>
                <PersonalInfoForm
                  form={form}
                  setForm={setForm}
                  touched={touched}
                  setTouched={setTouched}
                  handleSubmit={handleSubmit}
                  nameValid={nameValid}
                  phoneValid={phoneValid}
                  canSave={canSave}
                  user={user}
                  joinDate={joinDate}
                  updateProfile={updateProfile}
                  REQUIRED_MESSAGE={REQUIRED_MESSAGE}
                />

                <VehicleInfoForm
                  form={form}
                  setForm={setForm}
                  touched={touched}
                  setTouched={setTouched}
                  handleFileChange={handleFileChange}
                  vehicleValid={vehicleValid}
                  REQUIRED_MESSAGE={REQUIRED_MESSAGE}
                />
              </>
            )}

            <AvailabilitySettings availability={availability} setAvailability={setAvailability} />

            <NotificationSettings notifications={notifications} setNotifications={setNotifications} />
          </div>

          <div className="lg:col-span-1">
            <PerformanceStats
              totalDeliveries={totalDeliveries}
              completedToday={completedToday}
              pending={pending}
              totalEarnings={totalEarnings}
              completionRate={completionRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
