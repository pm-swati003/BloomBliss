import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export function OrdersTab({ orders, isOrdersLoading, formatOrderDate }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-[#1F2937] text-2xl font-bold mb-6">Order History</h2>
      {isOrdersLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-[#E91E8C] mx-auto mb-4" />
          <p className="text-[#6B7280] mb-4">You haven't placed any orders yet</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-[#E5E7EB] rounded-lg p-6 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[#1F2937] mb-1 font-bold">{order.order_number}</h3>
                  <p className="text-[#6B7280] text-sm">
                    {formatOrderDate(order.created_at || "")}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    order.status === "delivered"
                      ? "bg-[#10B981] text-white"
                      : order.status === "pending"
                        ? "bg-[#F59E0B] text-white"
                        : "bg-[#6B7280] text-white"
                  }`}
                >
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
                </span>
              </div>
              {order.items && order.items.length > 0 && (
                <p className="text-[#374151] mb-3">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}:{" "}
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.product_name || item.product?.name} (x{item.quantity})
                      {idx < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
              {order.tracking_number && (
                <div className="bg-[#FFF5F7] rounded-lg p-3 mb-4">
                  <p className="text-[#6B7280] text-sm">
                    Tracking:{" "}
                    <span className="text-[#E91E8C] font-semibold">{order.tracking_number}</span>
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center flex-wrap gap-3">
                <p className="text-[#1F2937] font-bold text-xl">
                  ₹{order.total?.toLocaleString("en-IN") || "0"}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm"
                  >
                    View Details
                  </Link>
                  {order.status === "delivered" && order.items?.some((i) => !i.has_review) && (
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg text-sm"
                    >
                      Write review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
