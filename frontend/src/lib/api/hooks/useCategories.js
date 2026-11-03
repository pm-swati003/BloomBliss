import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/categories");
      return data;
    },
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/categories/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
