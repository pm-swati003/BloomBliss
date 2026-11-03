import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/stats");
      return data;
    },
  });
}

export function useAdminRecentOrders() {
  return useQuery({
    queryKey: ["admin", "recent-orders"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/recent-orders");
      return data;
    },
  });
}

export function useAdminDeliveriesDueToday() {
  return useQuery({
    queryKey: ["admin", "deliveries-due-today"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/deliveries-due-today");
      return data;
    },
  });
}

export function useAdminLowStock(threshold = 20) {
  return useQuery({
    queryKey: ["admin", "low-stock", threshold],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/low-stock", {
        params: threshold ? { threshold } : undefined,
      });
      return data;
    },
  });
}

export function useAdminOrders(params) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/orders", { params });
      return data;
    },
  });
}

export function useAdminOrder(id) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/orders/${id}`);
      return data;
    },
    enabled: id != null,
  });
}

export function useAdminOrderUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await apiClient.put(`/admin/orders/${id}/status`, {
        status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "recent-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminOrderTracking(orderId, options) {
  return useQuery({
    queryKey: ["admin", "orders", orderId, "tracking"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/orders/${orderId}/tracking`);
      return data;
    },
    enabled: orderId != null,
    refetchInterval: options?.refetchInterval ?? 10000,
  });
}

export function useAdminOrderUpdateTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rider_lat, rider_lng, estimated_delivery_at }) => {
      const { data } = await apiClient.put(`/admin/orders/${id}/tracking`, {
        rider_lat: rider_lat ?? undefined,
        rider_lng: rider_lng ?? undefined,
        estimated_delivery_at: estimated_delivery_at || undefined,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders", variables.id, "tracking"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.id, "tracking"],
      });
    },
  });
}

export function useAdminProducts(params) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/products", { params });
      return data;
    },
  });
}

export function useAdminProductCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await apiClient.post("/admin/products", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      // Ensure numeric values are converted to numbers
      const payload = {
        ...body,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        discount_percentage:
          body.discount_percentage !== undefined
            ? parseFloat(body.discount_percentage)
            : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
        category_id: body.category_id
          ? parseInt(body.category_id, 10)
          : undefined,
      };
      const { data } = await apiClient.put(`/admin/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminProductDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/categories");
      return data;
    },
  });
}

export function useAdminCategoryCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await apiClient.post("/admin/categories", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminCustomers(params) {
  return useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/customers", { params });
      return data;
    },
  });
}

export function useAdminConfig() {
  return useQuery({
    queryKey: ["admin", "config"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/config");
      return data;
    },
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/settings");
      return data;
    },
  });
}

export function useAdminSettingsUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      await apiClient.put("/admin/settings", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}

export function useAdminStaff(params) {
  return useQuery({
    queryKey: ["admin", "staff", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/staff", { params });
      return data;
    },
  });
}

export function useAdminStaffCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await apiClient.post("/admin/staff", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useAdminStaffUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }) => {
      const { data } = await apiClient.put(`/admin/staff/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useAdminSubscribers(params) {
  return useQuery({
    queryKey: ["admin", "subscribers", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/subscribers", { params });
      return data;
    },
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/coupons");
      return data;
    },
  });
}

export function useAdminCouponCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await apiClient.post("/admin/coupons", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
}

export function useAdminCouponUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const { data } = await apiClient.put(`/admin/coupons/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
}

export function useAdminCouponDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
  });
}

export function useAdminSubscriberBenefits() {
  return useQuery({
    queryKey: ["admin", "subscriber-benefits"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/subscriber-benefits");
      return data;
    },
  });
}

export function useAdminSubscriberBenefitsUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (benefits) => {
      const { data } = await apiClient.put("/admin/subscriber-benefits", {
        benefits,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "subscriber-benefits"],
      });
    },
  });
}
