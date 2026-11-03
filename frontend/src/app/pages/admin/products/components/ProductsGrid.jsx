import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { ProductGridShimmer } from "@/app/components/effects/Shimmer";
import { getStatusLabel, getStatusColor } from "../hooks/useAdminProductsLogic";

export function ProductsGrid({
  products,
  isLoading,
  currentPage,
  lastPage,
  setPage,
  openEdit,
  handleDelete,
}) {
  if (isLoading) {
    return <ProductGridShimmer count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const statusLabel = getStatusLabel(product);
          const categoryName =
            (typeof product.category === "object" ? product.category?.name : null) ||
            (typeof product.category === "string" ? product.category : null) ||
            "General";

          return (
            <div
              key={product.id}
              className="border-2 border-[#E5E7EB] rounded-lg overflow-hidden hover:border-[#E91E8C] transition-all duration-300 hover:shadow-lg bg-white"
            >
              <div className="relative h-48 bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-[#E5E7EB]" />
                )}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(
                    statusLabel
                  )}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-[#1F2937] mb-1 font-bold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-[#E91E8C] text-sm font-medium mb-4">
                  {categoryName}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[#6B7280] text-xs mb-1">Price</p>
                    <p className="text-[#1F2937] font-bold text-lg">
                      {formatINR(product.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] text-xs mb-1">Stock</p>
                    <p className="text-[#1F2937] font-bold text-lg">{product.stock ?? 0} units</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#6B7280]">Sales</span>
                    <span className="text-[#374151] font-medium">{product.sold ?? 0} sold</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                    <div
                      className="bg-[#E91E8C] h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((product.sold ?? 0) / Math.max((product.sold ?? 0) + (product.stock || 0), 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 px-4 py-2.5 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="px-4 py-2.5 border-2 border-[#E5E7EB] text-[#6B7280] rounded-lg hover:border-[#EF4444] hover:text-[#EF4444] transition-all duration-300 flex items-center justify-center"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8">
        <p className="text-[#6B7280] text-sm">
          Page {currentPage} of {lastPage}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border-2 border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#E91E8C] hover:text-[#E91E8C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm font-bold">{currentPage}</span>
          <button
            disabled={currentPage >= lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border-2 border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#E91E8C] hover:text-[#E91E8C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
