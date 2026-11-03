import { Star, MapPin, Eye } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { TableRowShimmer } from "@/app/components/effects/Shimmer";
import { getDeliveryUrgency } from "../hooks/useAdminOrdersLogic";

export function OrdersTable({
  orders,
  isLoading,
  currentPage,
  lastPage,
  total,
  setPage,
  handleStatusChange,
  getStatusColor,
  openTrackingModal,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowShimmer key={i} cols={10} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto w-full rounded-lg border border-[#E5E7EB]">
        <table className="w-full min-w-[950px] divide-y divide-[#E5E7EB] text-left">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Order ID</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider min-w-[140px]">Customer</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider min-w-[160px]">Product(s)</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Date</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider min-w-[130px]">Deliver by</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Amount</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Payment</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider min-w-[130px]">Delivery person</th>
              <th className="py-3.5 px-3 text-[#6B7280] font-semibold text-xs uppercase tracking-wider whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white text-sm">
            {orders.map((order) => {
              const items = order.items ?? [];
              const firstItem = items[0];
              const productName =
                firstItem?.product_name ||
                order.product ||
                "Flower Bouquet";
              const extraCount = Math.max(0, items.length - 1);

              const date = order.created_at
                ? new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              const urgency = getDeliveryUrgency(order);

              const deliverByText = order.delivery_date
                ? `${new Date(order.delivery_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}${order.delivery_time ? ` (${order.delivery_time})` : ""}`
                : "Standard";

              const rowBg =
                urgency === "overdue"
                  ? "bg-red-50/60"
                  : urgency === "due-today"
                  ? "bg-amber-50/60"
                  : "";

              const customerName =
                order.customer ||
                order.user?.name ||
                (order.user?.email ? order.user.email.split("@")[0] : "Customer");

              const customerEmail =
                order.user?.email ||
                order.shipping_address?.email ||
                "";

              const paymentType =
                (typeof order.payment_method === "object" ? order.payment_method?.type : null) ||
                (typeof order.payment_method === "string" && order.payment_method.length < 20 ? order.payment_method : null) ||
                "Visa";

              return (
                <tr
                  key={order.id}
                  className={`hover:bg-[#FFF5F7] transition-colors duration-200 ${rowBg}`}
                >
                  <td className="py-3 px-3 font-mono font-medium text-[#1F2937] whitespace-nowrap">
                    {order.order_number || order.id?.substring(0, 8)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="max-w-[160px]">
                      <p className="text-[#1F2937] font-medium truncate" title={customerName}>{customerName}</p>
                      {customerEmail && (
                        <p className="text-[#6B7280] text-xs truncate" title={customerEmail}>{customerEmail}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="max-w-[180px]">
                      <p className="text-[#374151] font-medium truncate" title={productName}>
                        {productName}
                      </p>
                      {extraCount > 0 && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#FCE7F3] text-[#E91E8C] rounded text-[11px] font-semibold">
                          +{extraCount} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#6B7280] whitespace-nowrap">
                    {date}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${
                          urgency === "overdue"
                            ? "text-red-700 font-semibold"
                            : urgency === "due-today"
                            ? "text-amber-700 font-semibold"
                            : "text-[#374151]"
                        }`}
                      >
                        {deliverByText}
                      </span>
                      {urgency === "overdue" && (
                        <span className="w-fit mt-1 text-[11px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
                          Overdue
                        </span>
                      )}
                      {urgency === "due-today" && (
                        <span className="w-fit mt-1 text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                          Due Today
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#1F2937] font-bold whitespace-nowrap">
                    {formatINR(order.total ?? order.amount ?? 0)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 shadow-xs outline-none capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending" className="bg-white text-gray-800">Pending</option>
                      <option value="processing" className="bg-white text-gray-800">Processing</option>
                      <option value="shipped" className="bg-white text-gray-800">Shipped</option>
                      <option value="delivered" className="bg-white text-gray-800">Delivered</option>
                      <option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    {order.rider ? (
                      <div className="max-w-[140px]">
                        <p className="font-medium text-[#1F2937] text-xs truncate">{order.rider.name}</p>
                        {order.rider.phone && (
                          <p className="text-[11px] text-[#6B7280] truncate">{order.rider.phone}</p>
                        )}
                        {order.rider.delivery_rating != null && (
                          <p className="text-xs text-amber-600 flex items-center gap-0.5 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />{" "}
                            {Number(order.rider.delivery_rating).toFixed(1)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-xs text-gray-500 bg-gray-100 font-medium">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => openTrackingModal(order)}
                        className="p-1.5 text-[#9333EA] hover:bg-[#F3E8FF] rounded-lg transition-all duration-200"
                        title="View live tracking"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openTrackingModal(order)}
                        className="p-1.5 text-[#E91E8C] hover:bg-[#FFF5F7] rounded-lg transition-all duration-200"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#6B7280]">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <p className="text-[#6B7280] text-sm">
          Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{lastPage}</span> ({total} total orders)
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#E91E8C] hover:text-[#E91E8C] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm font-bold shadow-xs">
            {currentPage}
          </span>
          <button
            disabled={currentPage >= lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#E91E8C] hover:text-[#E91E8C] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
