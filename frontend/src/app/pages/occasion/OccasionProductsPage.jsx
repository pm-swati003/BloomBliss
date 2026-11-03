import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/lib/api/hooks/useCategories";
import { useOccasionProducts } from "@/lib/api/hooks/useOccasions";
import { ProductRenderer } from "../../components/data-renderers/ProductRenderer";
import { ProductGridShimmer } from "../../components/effects/Shimmer";

export function OccasionProductsPage({ occasionSlug, title, description }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const observerTarget = useRef(null);

  const { data: categories = [] } = useCategories();
  const selectedCategory = selectedCategorySlug
    ? categories.find(
        (cat) =>
          cat.slug === selectedCategorySlug ||
          cat.name === selectedCategorySlug,
      )?.slug || selectedCategorySlug
    : undefined;

  const getPriceParams = () => {
    if (priceRange === "Under ₹500") return { price_max: 499 };
    if (priceRange === "₹500 - ₹1000")
      return { price_min: 500, price_max: 1000 };
    if (priceRange === "₹1000 - ₹2000")
      return { price_min: 1000, price_max: 2000 };
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
  } = useOccasionProducts(occasionSlug, {
    category: selectedCategory,
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: 12,
    ...getPriceParams(),
  });

  const products = data?.pages.flatMap((page) => page.products) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 0.1 },
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategoryChange = (categorySlug) => {
    if (categorySlug === "All" || categorySlug === "") setSearchParams({});
    else setSearchParams({ category: categorySlug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [priceRange, sortBy, sortOrder]);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full bg-[#FFF5F7] py-12">
        <div className="max-w-[1440px] mx-auto px-20">
          <h1 className="text-[#E91E8C] mb-4">{title}</h1>
          <p className="text-[#6B7280]">{description}</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-20 py-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar filters – same as your original */}
          <div className="col-span-3">
            <div className="bg-[#F9FAFB] rounded-lg p-6 shadow-md border border-[#E5E7EB]">
              <h3 className="text-[#1F2937] mb-4">Filters</h3>
              <div className="mb-6">
                <h4 className="text-[#1F2937] mb-3">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategorySlug
                        ? "bg-[#E91E8C] text-white"
                        : "bg-white text-[#1F2937] hover:bg-[#FFF5F7]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategorySlug === cat.slug ||
                        selectedCategorySlug === cat.name
                          ? "bg-[#E91E8C] text-white"
                          : "bg-white text-[#1F2937] hover:bg-[#FFF5F7]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[#1F2937] mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    "All",
                    "Under ₹500",
                    "₹500 - ₹1000",
                    "₹1000 - ₹2000",
                    "Over ₹2000",
                  ].map((range) => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        priceRange === range
                          ? "bg-[#E91E8C] text-white"
                          : "bg-white text-[#1F2937] hover:bg-[#FFF5F7]"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="col-span-9">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-[#6B7280]">
                Showing {products.length} products
              </p>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg bg-white text-[#1F2937] focus:border-[#E91E8C] focus:outline-none"
              >
                <option value="created_at-desc">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {isLoading ? (
              <ProductGridShimmer />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">
                  Error loading products. Please try again.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B7280]">
                  No products found matching your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductRenderer key={product.id} product={product} />
                  ))}
                </div>
                <div
                  ref={observerTarget}
                  className="h-10 flex items-center justify-center py-8"
                >
                  {isFetchingNextPage && (
                    <p className="text-[#6B7280]">Loading more products...</p>
                  )}
                  {!hasNextPage && products.length > 0 && (
                    <p className="text-[#6B7280]">No more products to load</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
