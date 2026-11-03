import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";

function formatDeliveryDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RecentActiveDeliveries({ activeOrders = [] }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#1F2937] text-xl font-bold font-sans">Active Deliveries</h2>
        <Link
          to="/delivery/active"
          className="text-[#E91E8C] hover:text-[#DB1777] transition-colors duration-300 font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {activeOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#6B7280] text-lg font-medium">No active deliveries right now.</p>
            <p className="text-gray-400 text-sm mt-1">New orders assigned to you will appear here.</p>
          </div>
        ) : (
          activeOrders.slice(0, 3).map((delivery) => (
            <div
              key={delivery.id}
              className="border-2 border-[#E5E7EB] rounded-lg p-6 hover:border-[#E91E8C] transition-all duration-300 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[#1F2937] font-bold font-sans">{delivery.order_number}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#6B7280] text-white">
                      {delivery.status === "shipped" || delivery.status === "out_for_delivery" ? "Out for delivery" : "Ready"}
                    </span>
                  </div>
                  <p className="text-[#374151] mb-1 font-semibold">
                    {delivery.customer_name || delivery.customer || "Customer"}
                  </p>
                  <p className="text-[#6B7280] text-sm">
                    {delivery.product_summary || delivery.product || "Flower Bouquet"}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    delivery.status === "shipped" || delivery.status === "out_for_delivery"
                      ? "bg-[#E91E8C] text-white"
                      : "bg-[#F59E0B] text-white"
                  }`}
                >
                  {delivery.status === "shipped" || delivery.status === "out_for_delivery" ? "In Transit" : "Ready"}
                </span>
              </div>
              {delivery.address && (
                <div className="bg-[#FFF5F7] rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-2">
                    <MapPin className="w-4 h-4 text-[#E91E8C] mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-[#374151] text-sm">{delivery.address.full}</p>
                  </div>
                  {(delivery.delivery_date || delivery.delivery_time) && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-[#E91E8C] mr-2" />
                      <p className="text-[#6B7280] text-sm font-medium">
                        {formatDeliveryDate(delivery.delivery_date)}
                        {delivery.delivery_time ? ` • ${delivery.delivery_time}` : ""}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                {delivery.customer_phone && (
                  <a
                    href={`tel:${delivery.customer_phone}`}
                    className="flex-1 px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 text-center font-medium"
                  >
                    Call Customer
                  </a>
                )}
                <Link
                  to={`/delivery/active?order=${delivery.id}`}
                  className="flex-1 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 text-center font-medium"
                >
                  Start Delivery
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
