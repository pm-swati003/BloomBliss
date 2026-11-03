import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useProfile,
  useUpdateProfile,
  useUpdatePassword,
} from "@/lib/api/hooks/useProfile";
import { useOrders } from "@/lib/api/hooks/useOrders";
import {
  useAddresses,
  useUpdateAddress,
  useDeleteAddress,
} from "@/lib/api/hooks/useAddresses";
import {
  usePaymentMethods,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "@/lib/api/hooks/usePaymentMethods";
import { useMyPerks } from "@/lib/api/hooks/useNewsletter";
import { toast } from "sonner";

const TAB_FROM_URL = [
  "profile",
  "orders",
  "addresses",
  "payment",
  "perks",
  "settings",
];

export function useProfileLogic() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = TAB_FROM_URL.includes(tabParam) ? tabParam : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabParam && TAB_FROM_URL.includes(tabParam)) setActiveTab(tabParam);
  }, [tabParam]);

  const [showPassword, setShowPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true,
  });

  // API Hooks
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: orders = [], isLoading: isOrdersLoading } = useOrders();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();
  const { data: paymentMethods = [], isLoading: isPaymentMethodsLoading } = usePaymentMethods();
  const { data: perksData, isLoading: isPerksLoading } = useMyPerks();

  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();

  // Forms
  const [profileForm, setProfileForm] = useState({
    name: profileData?.user?.name || "",
    email: profileData?.user?.email || "",
    phone: profileData?.user?.phone || "",
    birthday: profileData?.user?.birthday || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (profileData?.user) {
      setProfileForm({
        name: profileData.user.name || "",
        email: profileData.user.email || "",
        phone: profileData.user.phone || "",
        birthday: profileData.user.birthday || "",
      });
    }
  }, [profileData]);

  // Handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((errorArray) => {
          if (Array.isArray(errorArray))
            errorArray.forEach((err) => toast.error(err));
          else toast.error(String(errorArray));
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await updatePassword.mutateAsync(passwordForm);
      toast.success("Password updated successfully!");
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((errorArray) => {
          if (Array.isArray(errorArray))
            errorArray.forEach((err) => toast.error(err));
          else toast.error(String(errorArray));
        });
      } else {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to update password"
        );
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await updateAddress.mutateAsync({ id, is_default: true });
      toast.success("Default address updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await deletePaymentMethod.mutateAsync(id);
      toast.success("Payment method deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete payment method");
    }
  };

  // Formatters
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
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
    updateProfilePending: updateProfile.isPending,
    updatePasswordPending: updatePassword.isPending,
    deleteAddressPending: deleteAddress.isPending,
    deletePaymentMethodPending: deletePaymentMethod.isPending,
  };
}
