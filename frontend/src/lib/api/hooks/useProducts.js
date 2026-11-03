import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";

export const useProducts = (filters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/products", { params: filters });
      return data.data || data;
    },
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useBestSellingProducts = () => {
  return useQuery({
    queryKey: ["products", "best-selling"],
    queryFn: async () => {
      const { data } = await apiClient.get("/products/best-selling");
      return data;
    },
  });
};
