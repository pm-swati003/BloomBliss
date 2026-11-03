import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews", {
        params: productId ? { product_id: productId } : {},
      });
      return data;
    },
    enabled: productId !== undefined,
  });
};

export const useLatestReviews = (limit = 6) => {
  return useQuery({
    queryKey: ["reviews", "latest", limit],
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews", { params: { limit } });
      return data;
    },
  });
};

export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews");
      return data;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await apiClient.post("/reviews", reviewData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.product_id],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", "latest"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rating, comment }) => {
      const { data } = await apiClient.put(`/reviews/${id}`, {
        rating,
        comment,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", data.product_id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "latest"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, productId }) => {
      await apiClient.delete(`/reviews/${id}`);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "latest"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
