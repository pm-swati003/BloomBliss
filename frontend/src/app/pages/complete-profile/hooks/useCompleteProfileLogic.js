import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteProfile, useProfile } from "@/lib/api/hooks/useProfile";
import { useCreateAddress } from "@/lib/api/hooks/useAddresses";
import { useCreatePaymentMethod } from "@/lib/api/hooks/usePaymentMethods";
import { toast } from "sonner";

export function useCompleteProfileLogic() {
  const navigate = useNavigate();
  const { data: profileData } = useProfile();
  const completeProfile = useCompleteProfile();
  const createAddress = useCreateAddress();
  const createPaymentMethod = useCreatePaymentMethod();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    phone: profileData?.user?.phone || "",
    birthday: profileData?.user?.birthday || "",
  });

  const [addressInfo, setAddressInfo] = useState({
    type: "Home",
    name: profileData?.user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: profileData?.user?.phone || "",
    is_default: true,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    type: "Visa",
    cardNumber: "",
    cardName: profileData?.user?.name || "",
    expiryDate: "",
    cvv: "",
    is_default: true,
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeProfile.mutateAsync({
        phone: profileInfo.phone,
        birthday: profileInfo.birthday,
      });
      setCurrentStep(2);
      toast.success("Profile information saved!");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((errorArray) => {
          if (Array.isArray(errorArray))
            errorArray.forEach((err) => toast.error(err));
          else toast.error(String(errorArray));
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to save profile information");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAddress.mutateAsync(addressInfo);
      setCurrentStep(3);
      toast.success("Address saved!");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((errorArray) => {
          if (Array.isArray(errorArray))
            errorArray.forEach((err) => toast.error(err));
          else toast.error(String(errorArray));
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to save address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rawCardNumber = paymentInfo.cardNumber.replace(/\s/g, "");
      if (rawCardNumber.length < 4) {
        toast.error("Please enter a valid card number (at least 4 digits)");
        setLoading(false);
        return;
      }
      const last4 = rawCardNumber.slice(-4);
      const expiry = paymentInfo.expiryDate;

      await createPaymentMethod.mutateAsync({
        type: paymentInfo.type,
        last4: last4,
        expiry: expiry,
        name: paymentInfo.cardName,
        is_default: paymentInfo.is_default,
      });

      await completeProfile.mutateAsync({
        phone: profileInfo.phone,
        birthday: profileInfo.birthday,
      });

      toast.success("Profile completed successfully! 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((errorArray) => {
          if (Array.isArray(errorArray))
            errorArray.forEach((err) => toast.error(err));
          else toast.error(String(errorArray));
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to save payment method");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(" ");
    return v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return v.substring(0, 2) + "/" + v.substring(2, 4);
    return v;
  };

  return {
    currentStep,
    setCurrentStep,
    loading,
    profileInfo,
    setProfileInfo,
    addressInfo,
    setAddressInfo,
    paymentInfo,
    setPaymentInfo,
    handleProfileSubmit,
    handleAddressSubmit,
    handlePaymentSubmit,
    formatCardNumber,
    formatExpiry,
  };
}
