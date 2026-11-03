import { useProductCollectionLogic } from "../hooks/useProductCollectionLogic";
import { ProductRenderer } from "@/app/components/data-renderers/ProductRenderer";
import { ProductGridShimmer } from "@/app/components/effects/Shimmer";

export function ProductCollectionTemplate({
  title,
  description,
  queryKeyPrefix,
  allowedCategories = null,
}) {
  const {
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
  } = useProductCollectionLogic({ queryKeyPrefix, allowedCategories });

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
          <div className="col-span-9">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-[#6B7280]">Showing {products.length} products</p>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split("-");
                  setSortBy(f);
                  setSortOrder(o);
                }}
                className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg bg-white focus:border-[#E91E8C]"
              >
                <option value="created_at-desc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
            {isLoading ? (
              <ProductGridShimmer count={12} />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading products.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p>No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductRenderer key={p.id} product={p} />
                  ))}
                </div>
                <div
                  ref={observerTarget}
                  className="h-10 flex items-center justify-center py-8"
                >
                  {isFetchingNextPage && <p>Loading more...</p>}
                  {!hasNextPage && products.length > 0 && <p>No more products</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
