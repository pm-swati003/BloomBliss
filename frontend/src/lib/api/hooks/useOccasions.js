import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../client";

export const useOccasions = () => {
  return useQuery({
    queryKey: ["occasions"],
    queryFn: async () => {
      const { data } = await apiClient.get("/occasions");
      return data;
    },
  });
};

export const useOccasion = (slug) => {
  return useQuery({
    queryKey: ["occasions", slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/occasions/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useOccasionProducts = (slug, filters) => {
  return useInfiniteQuery({
    queryKey: ["occasions", slug, "products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        per_page: filters?.per_page || 12,
        ...filters,
      };

      const response = await apiClient.get(`/occasions/${slug}/products`, {
        params,
      });
      const responseData = response.data;

      if (
        responseData &&
        responseData.data &&
        Array.isArray(responseData.data)
      ) {
        return {
          products: responseData.data,
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          has_more:
            (responseData.current_page || 1) < (responseData.last_page || 1),
        };
      }

      if (Array.isArray(responseData)) {
        return {
          products: responseData,
          current_page: 1,
          last_page: 1,
          has_more: false,
        };
      }

      return {
        products: [],
        current_page: 1,
        last_page: 1,
        has_more: false,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!slug,
  });
};
