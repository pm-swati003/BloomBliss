import { useParams, Link, useNavigate } from "react-router-dom";
import { useOrder } from "@/lib/api/hooks/useOrders";
import { ArrowLeft, Package, Star, MapPin } from "lucide-react";

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id ? parseInt(id, 10) : 0;
  const { data: order, isLoading } = useOrder(orderId);
  if (isLoading)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p>Loading order...</p>
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div>
          <p>Order not found</p>
          <Link to="/profile?tab=orders" className="text-[#E91E8C]">
            Back to Order History
          </Link>
        </div>
      </div>
    );
  const statusColors = {
    delivered: "bg-[#10B981] text-white",
    pending: "bg-[#F59E0B] text-white",
    processing: "bg-[#3B82F6] text-white",
    shipped: "bg-[#8B5CF6] text-white",
    cancelled: "bg-[#6B7280] text-white",
  };
  const statusColor = statusColors[order.status] || "bg-[#6B7280] text-white";
  const isDelivered = order.status === "delivered";
  const itemsNeedingReview =
    order.items?.filter((i) => isDelivered && !i.has_review) ?? [];
  return (
    <div className="min-h-screen bg-[#FFF5F7] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate("/profile?tab=orders")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C] mb-6"
        >
          <ArrowLeft size={20} />
          Back to Order History
        </button>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-xl font-bold">{order.order_number}</h1>
              <p className="text-sm text-[#6B7280]">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}
            >
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>
          {(order.tracking_number || order.status !== "cancelled") && (
            <div className="px-6 py-3 bg-[#FFF5F7] border-b flex flex-wrap justify-between items-center gap-2">
              {order.tracking_number && (
                <p className="text-sm">
                  Tracking:{" "}
                  <span className="text-[#E91E8C] font-medium">
                    {order.tracking_number}
                  </span>
                </p>
              )}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <Link
                  to={`/orders/${order.id}/track`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm"
                >
                  <MapPin size={18} />
                  Track order
                </Link>
              )}
            </div>
          )}
          <div className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Items
            </h2>
            <ul className="space-y-4">
              {order.items?.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap justify-between gap-4 py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.product_name || item.product?.name}
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      Qty: {item.quantity} × ₹
                      {Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {isDelivered &&
                    (item.has_review ? (
                      <span className="text-sm text-[#10B981]">Reviewed</span>
                    ) : (
                      <Link
                        to={`/product/${item.product_id}?review=1`}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-[#E91E8C] text-white rounded-lg text-sm"
                      >
                        <Star size={16} />
                        Write review
                      </Link>
                    ))}
                </li>
              ))}
            </ul>
          </div>
          {itemsNeedingReview.length > 0 && (
            <div className="px-6 py-4 bg-[#FFF5F7] border-t">
              <p className="text-sm mb-2">
                How was your order? Your review helps other customers.
              </p>
              <div className="flex flex-wrap gap-2">
                {itemsNeedingReview.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.product_id}?review=1`}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-white border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg text-sm"
                  >
                    <Star size={14} />
                    Review {item.product_name || item.product?.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="p-6 border-t flex justify-between items-center">
            <span className="text-[#6B7280]">Total</span>
            <span className="text-xl font-bold text-[#E91E8C]">
              ₹{Number(order.total).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
