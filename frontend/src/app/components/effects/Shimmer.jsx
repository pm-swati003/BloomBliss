export function Shimmer({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// Product card skeleton (used in Shop, Occasions, etc.)
export function ProductCardShimmer() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E5E7EB]">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    </div>
  );
}

// Product detail skeleton (full page)
export function ProductDetailShimmer() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table row skeleton (for admin tables)
export function TableRowShimmer({ cols = 6 }) {
  return (
    <div className="border-b border-[#E5E7EB] hover:bg-[#FFF5F7] transition-colors">
      <div className="flex items-center py-4 px-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-5 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

// Grid of product card shimmers (for shop pages)
export function ProductGridShimmer({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardShimmer key={i} />
      ))}
    </div>
  );
}
