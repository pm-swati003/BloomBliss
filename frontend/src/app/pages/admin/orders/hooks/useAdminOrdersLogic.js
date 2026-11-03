import { useState } from "react";
import {
  useAdminOrders,
  useAdminOrderUpdateStatus,
  useAdminOrderUpdateTracking,
} from "@/lib/api/hooks/useAdmin";
import { toast } from "sonner";

export const today = () => new Date().toISOString().slice(0, 10);

export function getDeliveryUrgency(order) {
  if (
    !order.delivery_date ||
    order.status === "delivered" ||
    order.status === "cancelled"
  )
    return null;
  const d = order.delivery_date;
  if (d < today()) return "overdue";
  if (d === today()) return "due-today";
  return null;
}

export function useAdminOrdersLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    riderLat: "",
    riderLng: "",
    estimatedAt: "",
  });

  const { data: ordersData, isLoading } = useAdminOrders({
    search: searchTerm || undefined,
    status: filterStatus === "all" ? undefined : filterStatus,
    page,
    per_page: 15,
  });

  const updateStatus = useAdminOrderUpdateStatus();
  const updateTracking = useAdminOrderUpdateTracking();

  const openTrackingModal = (order) => {
    setTrackingOrder({ id: order.id, order_number: order.order_number });
    setShowOverrideForm(false);
    setOverrideForm({
      riderLat: order.rider_lat != null ? String(order.rider_lat) : "",
      riderLng: order.rider_lng != null ? String(order.rider_lng) : "",
      estimatedAt: order.estimated_delivery_at
        ? new Date(order.estimated_delivery_at).toISOString().slice(0, 16)
        : "",
    });
  };

  const handleSaveOverrideTracking = () => {
    if (!trackingOrder) return;
    const lat = overrideForm.riderLat ? parseFloat(overrideForm.riderLat) : null;
    const lng = overrideForm.riderLng ? parseFloat(overrideForm.riderLng) : null;
    if (
      (lat != null && (Number.isNaN(lat) || lat < -90 || lat > 90)) ||
      (lng != null && (Number.isNaN(lng) || lng < -180 || lng > 180))
    ) {
      toast.error("Invalid coordinates. Lat: -90 to 90, Lng: -180 to 180");
      return;
    }
    updateTracking.mutate(
      {
        id: trackingOrder.id,
        rider_lat: lat,
        rider_lng: lng,
        estimated_delivery_at: overrideForm.estimatedAt
          ? new Date(overrideForm.estimatedAt).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          toast.success("Rider location & ETA updated.");
          setShowOverrideForm(false);
        },
        onError: (e) => toast.error(e?.response?.data?.message ?? "Failed to update tracking"),
      }
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus.mutate(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: (e) => toast.error(e?.response?.data?.message ?? "Failed to update status"),
      }
    );
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-[#10B981] text-white";
    if (s === "processing") return "bg-[#E91E8C] text-white";
    if (s === "shipped") return "bg-[#9333EA] text-white";
    if (s === "pending") return "bg-[#F59E0B] text-white";
    if (s === "cancelled") return "bg-[#EF4444] text-white";
    return "bg-[#6B7280] text-white";
  };

  const orders = ordersData?.data ?? [];
  const currentPage = ordersData?.current_page ?? 1;
  const lastPage = ordersData?.last_page ?? 1;
  const total = ordersData?.total ?? 0;

  const dueTodayCount = orders.filter((o) => getDeliveryUrgency(o) === "due-today").length;
  const overdueCount = orders.filter((o) => getDeliveryUrgency(o) === "overdue").length;
  const showDeliveryAlert = dueTodayCount > 0 || overdueCount > 0;

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    trackingOrder,
    setTrackingOrder,
    showOverrideForm,
    setShowOverrideForm,
    overrideForm,
    setOverrideForm,
    orders,
    isLoading,
    currentPage,
    lastPage,
    total,
    dueTodayCount,
    overdueCount,
    showDeliveryAlert,
    openTrackingModal,
    handleSaveOverrideTracking,
    handleStatusChange,
    getStatusColor,
    updateTracking,
  };
}
