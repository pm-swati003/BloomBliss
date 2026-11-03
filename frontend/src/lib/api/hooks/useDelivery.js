import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import {
  deliveryApiClient,
  clearDeliverySession,
  setDeliveryToken,
  getDeliveryToken,
} from "../deliveryClient";

export function useDeliveryMe() {
  return useQuery({
    queryKey: ["delivery", "me"],
    queryFn: async () => {
      const { data } = await deliveryApiClient.get("/auth/me");
      return data;
    },
    enabled: !!getDeliveryToken(),
    retry: false,
  });
}

export function useDeliveryOrders(status) {
  return useQuery({
    queryKey: ["delivery", "orders", status],
    queryFn: async () => {
      const { data } = await deliveryApiClient.get("/delivery/orders", {
        params: status ? { status } : undefined,
      });
      return data;
    },
  });
}

export function useDeliveryStats() {
  return useQuery({
    queryKey: ["delivery", "stats"],
    queryFn: async () => {
      const { data } = await deliveryApiClient.get("/delivery/stats");
      return data;
    },
  });
}

export function useDeliveryProfileUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await deliveryApiClient.post("/delivery/profile", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "me"] });
    },
  });
}

export function useDeliveryUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rider_lat, rider_lng, estimated_delivery_at }) => {
      const { data } = await deliveryApiClient.put(
        `/delivery/orders/${id}/location`,
        {
          rider_lat,
          rider_lng,
          estimated_delivery_at: estimated_delivery_at || undefined,
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["delivery", "stats"] });
    },
  });
}

export function useDeliveryMarkDelivered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, distance_km }) => {
      const { data } = await deliveryApiClient.put(
        `/delivery/orders/${id}/delivered`,
        { distance_km }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["delivery", "stats"] });
    },
  });
}

export async function deliveryLogin(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  if (data.user?.role !== "delivery") {
    throw new Error("Not a delivery account. Use the delivery partner login.");
  }
  setDeliveryToken(data.token);
  if (data.user)
    localStorage.setItem("delivery_user", JSON.stringify(data.user));
  return { user: data.user, token: data.token };
}

export function deliveryLogout() {
  clearDeliverySession();
  window.location.href = "/login";
}
