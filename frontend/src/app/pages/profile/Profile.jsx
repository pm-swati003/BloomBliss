import { User } from "lucide-react";
import { useProfileLogic } from "./hooks/useProfileLogic";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { OrdersTab } from "./components/OrdersTab";
import { AddressesTab } from "./components/AddressesTab";
import { PaymentMethodsTab } from "./components/PaymentMethodsTab";
import { PerksTab } from "./components/PerksTab";
import { SettingsTab } from "./components/SettingsTab";

export function Profile() {
  const {
    activeTab,
    setActiveTab,
    profileData,
    isProfileLoading,
    orders,
    isOrdersLoading,
    addresses,
    isAddressesLoading,
    paymentMethods,
    isPaymentMethodsLoading,
    perksData,
    isPerksLoading,
    isEditingProfile,
    setIsEditingProfile,
    profileForm,
    setProfileForm,
    showPassword,
    setShowPassword,
    passwordForm,
    setPasswordForm,
    notifications,
    setNotifications,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleDeletePaymentMethod,
    formatDate,
    formatOrderDate,
    updateProfilePending,
    updatePasswordPending,
    deleteAddressPending,
    deletePaymentMethodPending,
  } = useProfileLogic();

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-white text-3xl font-bold mb-2">My Account</h1>
              <p className="text-white/90">
                {profileData?.user?.email || "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="lg:col-span-2">
            {activeTab === "profile" && (
              <PersonalInfoTab
                profileData={profileData}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                handleProfileUpdate={handleProfileUpdate}
                updateProfilePending={updateProfilePending}
                formatDate={formatDate}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                isOrdersLoading={isOrdersLoading}
                formatOrderDate={formatOrderDate}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesTab
                addresses={addresses}
                isAddressesLoading={isAddressesLoading}
                handleSetDefaultAddress={handleSetDefaultAddress}
                handleDeleteAddress={handleDeleteAddress}
                deleteAddressPending={deleteAddressPending}
              />
            )}

            {activeTab === "payment" && (
              <PaymentMethodsTab
                paymentMethods={paymentMethods}
                isPaymentMethodsLoading={isPaymentMethodsLoading}
                handleDeletePaymentMethod={handleDeletePaymentMethod}
                deletePaymentMethodPending={deletePaymentMethodPending}
              />
            )}

            {activeTab === "perks" && (
              <PerksTab perksData={perksData} isPerksLoading={isPerksLoading} />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                notifications={notifications}
                setNotifications={setNotifications}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                handlePasswordUpdate={handlePasswordUpdate}
                updatePasswordPending={updatePasswordPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
