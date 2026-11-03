import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await apiClient.get("/orders");
      return data;
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/orders/${id}`);
      return data;
    },
    enabled: !!id && !!localStorage.getItem("token"),
  });
};

export const useOrderTracking = (orderId, options) => {
  return useQuery({
    queryKey: ["orders", orderId, "tracking"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/orders/${orderId}/tracking`);
      return data;
    },
    enabled: !!orderId && !!localStorage.getItem("token"),
    refetchInterval: options?.refetchInterval ?? 10000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await apiClient.post("/orders", orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
    },
  });
};
