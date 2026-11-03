import { useState } from "react";
import {
  useAdminSubscribers,
  useAdminCoupons,
  useAdminCouponCreate,
  useAdminCouponUpdate,
  useAdminCouponDelete,
  useAdminSubscriberBenefits,
  useAdminSubscriberBenefitsUpdate,
} from "@/lib/api/hooks/useAdmin";
import { toast } from "sonner";

export const emptyCouponForm = {
  code: "",
  description: "",
  discount_type: "percent",
  value: "",
  min_order: "",
  for_subscribers_only: false,
  valid_from: "",
  valid_until: "",
  usage_limit: "",
  is_active: true,
};

export function useAdminSubscribersLogic() {
  const [activeTab, setActiveTab] = useState("subscribers");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [subscriberPage, setSubscriberPage] = useState(1);
  
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState(emptyCouponForm);
  
  const [benefitsDraft, setBenefitsDraft] = useState([]);
  const [benefitsEditing, setBenefitsEditing] = useState(false);

  const { data: subscribersData, isLoading: loadingSubscribers } = useAdminSubscribers({
    search: subscriberSearch || undefined,
    page: subscriberPage,
    per_page: 20,
  });

  const {
    data: coupons = [],
    isLoading: loadingCoupons,
    refetch: refetchCoupons,
  } = useAdminCoupons();

  const { data: benefitsData, isLoading: loadingBenefits } = useAdminSubscriberBenefits();
  
  const createCoupon = useAdminCouponCreate();
  const updateCoupon = useAdminCouponUpdate();
  const deleteCoupon = useAdminCouponDelete();
  const updateBenefits = useAdminSubscriberBenefitsUpdate();

  const subscribers = subscribersData?.data ?? [];
  const benefits = benefitsData?.benefits ?? [];

  // Coupons
  const openNewCoupon = () => {
    setEditingCoupon(null);
    setCouponForm(emptyCouponForm);
    setCouponModalOpen(true);
  };

  const openEditCoupon = (c) => {
    setEditingCoupon(c);
    setCouponForm({
      code: c.code,
      description: c.description ?? "",
      discount_type: c.discount_type,
      value: String(c.value),
      min_order: c.min_order != null ? String(c.min_order) : "",
      for_subscribers_only: c.for_subscribers_only,
      valid_from: c.valid_from ? c.valid_from.slice(0, 10) : "",
      valid_until: c.valid_until ? c.valid_until.slice(0, 10) : "",
      usage_limit: c.usage_limit != null ? String(c.usage_limit) : "",
      is_active: c.is_active,
    });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = () => {
    const value = parseFloat(couponForm.value);
    if (isNaN(value) || value < 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    if (couponForm.discount_type === "percent" && value > 100) {
      toast.error("Percent discount cannot exceed 100");
      return;
    }
    const payload = {
      code: couponForm.code.trim(),
      description: couponForm.description.trim() || undefined,
      discount_type: couponForm.discount_type,
      value,
      min_order: couponForm.min_order ? parseFloat(couponForm.min_order) : undefined,
      for_subscribers_only: couponForm.for_subscribers_only,
      valid_from: couponForm.valid_from || undefined,
      valid_until: couponForm.valid_until || undefined,
      usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit, 10) : undefined,
      is_active: couponForm.is_active,
    };

    if (editingCoupon) {
      updateCoupon.mutate(
        { id: editingCoupon.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Coupon updated");
            setCouponModalOpen(false);
          },
          onError: (e) => toast.error(e?.response?.data?.error ?? "Failed to update coupon"),
        }
      );
    } else {
      createCoupon.mutate(payload, {
        onSuccess: () => {
          toast.success("Coupon created");
          setCouponModalOpen(false);
        },
        onError: (e) => toast.error(e?.response?.data?.error ?? "Failed to create coupon"),
      });
    }
  };

  const handleDeleteCoupon = (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    deleteCoupon.mutate(id, {
      onSuccess: () => toast.success("Coupon deleted"),
      onError: (e) => toast.error(e?.response?.data?.error ?? "Failed to delete"),
    });
  };

  // Benefits
  const startEditBenefits = () => {
    setBenefitsDraft([...benefits]);
    setBenefitsEditing(true);
  };

  const cancelEditBenefits = () => {
    setBenefitsDraft([]);
    setBenefitsEditing(false);
  };

  const addBenefitRow = () => {
    setBenefitsDraft((d) => [...d, { title: "", description: "" }]);
  };

  const updateBenefitRow = (index, field, value) => {
    setBenefitsDraft((d) => {
      const next = [...d];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeBenefitRow = (index) => {
    setBenefitsDraft((d) => d.filter((_, i) => i !== index));
  };

  const saveBenefits = () => {
    const valid = benefitsDraft.filter((b) => b.title.trim());
    updateBenefits.mutate(valid, {
      onSuccess: () => {
        toast.success("Subscriber benefits updated");
        setBenefitsEditing(false);
      },
      onError: (e) => toast.error(e?.response?.data?.error ?? "Failed to save"),
    });
  };

  return {
    activeTab,
    setActiveTab,
    subscriberSearch,
    setSubscriberSearch,
    subscriberPage,
    setSubscriberPage,
    subscribers,
    subscribersData,
    loadingSubscribers,
    coupons,
    loadingCoupons,
    couponModalOpen,
    setCouponModalOpen,
    editingCoupon,
    couponForm,
    setCouponForm,
    openNewCoupon,
    openEditCoupon,
    handleSaveCoupon,
    handleDeleteCoupon,
    createCoupon,
    updateCoupon,
    benefits,
    loadingBenefits,
    benefitsDraft,
    benefitsEditing,
    startEditBenefits,
    cancelEditBenefits,
    addBenefitRow,
    updateBenefitRow,
    removeBenefitRow,
    saveBenefits,
    updateBenefits,
  };
}
