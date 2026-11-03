import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useDeliveryMe,
  useDeliveryStats,
  useDeliveryProfileUpdate,
} from "@/lib/api/hooks/useDelivery";

export function useDeliveryProfileLogic() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(true);
  const [notifications, setNotifications] = useState({
    newDeliveries: true,
    orderUpdates: true,
    earnings: true,
  });
  const [form, setForm] = useState({ 
    name: "", phone: "", birthday: "", 
    vehicle_type: "", vehicle_model: "", license_plate: "", license_number: "", document: null 
  });
  const [touched, setTouched] = useState({ 
    name: false, phone: false, vehicle_type: false, license_plate: false 
  });
  
  const { data: user, isLoading: userLoading } = useDeliveryMe();
  const [isEditing, setIsEditing] = useState(false);
  const { data: stats } = useDeliveryStats();
  const updateProfile = useDeliveryProfileUpdate();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        birthday: user.birthday ? new Date(user.birthday).toISOString().slice(0, 10) : "",
        vehicle_type: user.profile?.vehicle_type ?? "",
        vehicle_model: user.profile?.vehicle_model ?? "",
        license_plate: user.profile?.license_plate ?? "",
        license_number: user.profile?.license_number ?? "",
        document: null,
      });
      if (user.profile_completed === false) {
          setIsEditing(true);
      }
    }
  }, [user]);

  const totalDeliveries = stats?.total_deliveries ?? stats?.completed_deliveries ?? 0;
  const completedToday = stats?.completed_today ?? stats?.delivered_today ?? 0;
  const pending = stats?.pending ?? 0;
  const totalEarnings = stats?.total_earnings ?? 0;
  const completionRate = totalDeliveries > 0 ? Math.round((completedToday / totalDeliveries) * 100) : 0;

  const profileCompleted = user?.profile_completed === true;
  const nameValid = form.name.trim() !== "";
  const phoneValid = form.phone.trim() !== "";
  const vehicleValid = form.vehicle_type.trim() !== "" && form.license_plate.trim() !== "";
  const canSave = nameValid && phoneValid && vehicleValid;

  const REQUIRED_MESSAGE = "Required — needed to complete your profile and receive orders.";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, document: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) {
      setTouched({ name: true, phone: true, vehicle_type: true, license_plate: true });
      toast.error("Please fill in all required fields.");
      return;
    }
    
    const formData = new FormData();
    formData.append("name", form.name.trim());
    if (form.phone.trim()) formData.append("phone", form.phone.trim());
    if (form.birthday.trim()) formData.append("birthday", form.birthday.trim());
    if (form.vehicle_type.trim()) formData.append("vehicle_type", form.vehicle_type.trim());
    if (form.vehicle_model.trim()) formData.append("vehicle_model", form.vehicle_model.trim());
    if (form.license_plate.trim()) formData.append("license_plate", form.license_plate.trim());
    if (form.license_number.trim()) formData.append("license_number", form.license_number.trim());
    if (form.document) formData.append("document", form.document);

    updateProfile.mutate(formData, {
        onSuccess: (data) => {
          toast.success("Profile saved successfully.");
          setIsEditing(false);
        },
        onError: (err) => {
          const msg = err?.response?.data?.errors
            ? Object.values(err.response.data.errors).flat().join(" ")
            : err?.response?.data?.message ?? "Failed to save profile.";
          toast.error(msg);
        },
      }
    );
  };

  const displayName = user?.name?.trim() || form.name.trim() || "Delivery Partner";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return {
    navigate,
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
    stats,
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
  };
}
