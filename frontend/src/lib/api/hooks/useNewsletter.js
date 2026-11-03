import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../client";

export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await apiClient.post("/newsletter/subscribe", {
        email: email.trim().toLowerCase(),
      });
      return data;
    },
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (params) => {
      const { data } = await apiClient.post("/coupons/validate", params);
      return data;
    },
  });
}

export function useMyPerks() {
  return useQuery({
    queryKey: ["newsletter", "my-perks"],
    queryFn: async () => {
      const { data } = await apiClient.get("/newsletter/my-perks");
      return data;
    },
    enabled: !!localStorage.getItem("token"),
  });
}
