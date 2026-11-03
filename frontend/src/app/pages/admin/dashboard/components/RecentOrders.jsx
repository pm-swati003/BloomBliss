import { Link } from "react-router-dom";
import { formatINR } from "@/lib/utils/currency";

export function RecentOrders({ recentOrders, ordersLoading }) {
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-[#10B981] text-white";
    if (s === "processing") return "bg-[#E91E8C] text-white";
    if (s === "shipped") return "bg-[#9333EA] text-white";
    if (s === "pending") return "bg-[#F59E0B] text-white";
    if (s === "cancelled") return "bg-[#EF4444] text-white";
    return "bg-[#6B7280] text-white";
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#1F2937] text-xl font-bold">Recent Orders</h2>
        <Link
          to="/admin/orders"
          className="text-[#E91E8C] hover:text-[#DB1777] font-medium transition-colors duration-300"
        >
          View All
        </Link>
      </div>
      {ordersLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-[#E5E7EB] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
          <table className="w-full min-w-[650px] divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Product</th>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Deliver by</th>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] bg-white">
              {(recentOrders ?? []).map((order) => {
                const customerName =
                  order.customer ||
                  order.user?.name ||
                  (order.user?.email ? order.user.email.split("@")[0] : "Customer");

                const firstItem = order.items?.[0];
                const productName =
                  order.product ||
                  firstItem?.product_name ||
                  "Flower Item";

                const extraCount = Math.max(0, (order.items?.length || 0) - 1);

                const amount = order.amount ?? order.total ?? 0;

                const deliverByText = order.delivery_date
                  ? `${new Date(order.delivery_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}${order.delivery_time ? ` (${order.delivery_time})` : ""}`
                  : order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  : "Standard";

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FFF5F7] transition-colors duration-200"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-[#1F2937] text-sm whitespace-nowrap">
                      {order.order_number || order.id?.substring(0, 8)}
                    </td>
                    <td className="py-4 px-4 text-[#374151] font-medium text-sm">
                      {customerName}
                    </td>
                    <td className="py-4 px-4 text-[#374151] text-sm">
                      <div className="max-w-[200px]">
                        <p className="truncate" title={productName}>
                          {productName}
                        </p>
                        {extraCount > 0 && (
                          <span className="text-[11px] text-[#E91E8C] font-semibold">
                            +{extraCount} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] text-sm whitespace-nowrap">
                      {deliverByText}
                    </td>
                    <td className="py-4 px-4 text-[#1F2937] font-bold text-sm whitespace-nowrap">
                      {formatINR(amount)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
