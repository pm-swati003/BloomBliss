import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function LowStock({ lowStock, lowStockLoading }) {
  return (
    <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <AlertCircle className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-[#1F2937] text-xl font-bold">Low Stock Alert</h2>
      </div>
      {lowStockLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#E5E7EB] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(lowStock ?? []).map((product) => {
            const threshold = product.threshold || 20;
            const stock = product.stock ?? 0;
            const percentage = Math.min(
              Math.max((stock / threshold) * 100, 5),
              100,
            );

            return (
              <div
                key={product.id}
                className="border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#374151] font-medium truncate pr-2 text-sm">
                    {product.name}
                  </h3>
                  <span className="text-[#E91E8C] font-bold text-sm whitespace-nowrap">
                    {stock} left
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                  <div
                    className="bg-[#E91E8C] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
                <p className="text-[#6B7280] text-xs mt-1">
                  Threshold: {threshold} units
                </p>
              </div>
            );
          })}
          {(!lowStock || lowStock.length === 0) && (
            <p className="text-[#6B7280] text-sm py-4 text-center">
              No low stock items
            </p>
          )}
          <Link
            to="/admin/products"
            className="block w-full text-center px-4 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 mt-4 font-medium text-sm shadow-md"
          >
            Manage Inventory
          </Link>
        </div>
      )}
    </div>
  );
}
