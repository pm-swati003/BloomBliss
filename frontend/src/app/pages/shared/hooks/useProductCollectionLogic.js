import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/lib/api/hooks/useCategories";
import apiClient from "@/lib/api/client";

export function useProductCollectionLogic({ queryKeyPrefix, allowedCategories = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const observerTarget = useRef(null);

  const { data: allCategories = [] } = useCategories();
  
  // Filter categories if allowedCategories is provided
  const categories = allowedCategories 
    ? allCategories.filter(cat => allowedCategories.includes(cat.slug))
    : allCategories;

  const selectedCategory = selectedCategorySlug
    ? allCategories.find(
        (cat) =>
          cat.slug === selectedCategorySlug ||
          cat.name === selectedCategorySlug
      )?.slug || selectedCategorySlug
    : undefined;

  const getPriceParams = () => {
    if (priceRange === "Under ₹500") return { price_max: 499 };
    if (priceRange === "₹500 - ₹1000") return { price_min: 500, price_max: 1000 };
    if (priceRange === "₹1000 - ₹2000") return { price_min: 1000, price_max: 2000 };
    if (priceRange === "Over ₹2000") return { price_min: 2001 };
    return {};
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      queryKeyPrefix,
      selectedCategory,
      priceRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        per_page: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...getPriceParams(),
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await apiClient.get("/products", { params });
      const rd = response.data;
      
      let filteredProducts = [];
      if (rd && rd.data && Array.isArray(rd.data)) {
        filteredProducts = rd.data;
      } else if (Array.isArray(rd)) {
        filteredProducts = rd;
      }

      // If allowedCategories are specified and no specific category is selected,
      // we must filter the results client-side (or ensure API handles it)
      if (allowedCategories && !selectedCategory) {
        filteredProducts = filteredProducts.filter((p) => {
          const slug = p.category?.slug || "";
          return allowedCategories.includes(slug);
        });
      }

      return {
        products: filteredProducts,
        current_page: rd?.current_page || 1,
        last_page: rd?.last_page || 1,
        has_more: (rd?.current_page || 1) < (rd?.last_page || 1),
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.current_page + 1 : undefined,
    initialPageParam: 1,
  });

  const products = data?.pages.flatMap((p) => p.products) || [];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    const t = observerTarget.current;
    if (t) obs.observe(t);
    return () => {
      if (t) obs.unobserve(t);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategoryChange = (slug) => {
    if (slug === "All" || slug === "") setSearchParams({});
    else setSearchParams({ category: slug });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [priceRange, sortBy, sortOrder]);

  return {
    categories,
    products,
    selectedCategorySlug,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    observerTarget,
  };
}
