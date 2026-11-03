import { MapPin, Phone, Navigation, CheckCircle } from "lucide-react";

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

export function ActiveOrdersList({
  displayOrders,
  locationSharing,
  selectedOrderId,
  startLocationSharing,
  stopLocationSharing,
  handleMarkDelivered,
  openInMaps,
  markDeliveredPending,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {displayOrders.map((delivery) => (
        <div
          key={delivery.id}
          className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#E5E7EB] hover:border-[#E91E8C] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[#1F2937] mb-2 font-bold text-lg font-sans">{delivery.order_number}</h3>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  delivery.status === "shipped" || delivery.status === "out_for_delivery"
                    ? "bg-[#E91E8C] text-white"
                    : "bg-[#F59E0B] text-white"
                }`}
              >
                {delivery.status === "shipped" || delivery.status === "out_for_delivery" ? "Out for delivery" : "Ready"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[#374151] mb-1 font-semibold font-sans">
              {delivery.customer_name || delivery.customer || "Customer"}
            </h3>
            <p className="text-[#6B7280] text-sm mb-3">
              {delivery.product_summary || delivery.product || "Flower Bouquet"}
            </p>
            {delivery.address && (
              <div className="bg-[#FFF5F7] rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-[#E91E8C] mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-[#374151] text-sm">{delivery.address.full}</p>
                </div>
                {delivery.customer_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-[#E91E8C] mr-2" />
                    <a
                      href={`tel:${delivery.customer_phone}`}
                      className="text-[#E91E8C] text-sm hover:text-[#DB1777] font-medium"
                    >
                      {delivery.customer_phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-6">
            {delivery.delivery_date && (
              <div className="flex-1 bg-[#FFF5F7] rounded-lg p-3 text-center">
                <p className="text-[#6B7280] text-sm mb-1 font-medium font-sans">Scheduled</p>
                <p className="text-[#374151] font-semibold">
                  {formatDeliveryDate(delivery.delivery_date)}
                  {delivery.delivery_time ? ` (${delivery.delivery_time})` : ""}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {delivery.address && (
              <button
                onClick={() => openInMaps(delivery.address.full)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <Navigation className="w-5 h-5" />
                Navigate to Address
              </button>
            )}
            {locationSharing && selectedOrderId === delivery.id ? (
              <button
                onClick={stopLocationSharing}
                className="w-full px-4 py-3 bg-[#6B7280] text-white rounded-lg hover:bg-[#4B5563] transition-all duration-300 font-medium"
              >
                Stop Sharing Location
              </button>
            ) : (
              <button
                onClick={() => startLocationSharing(delivery.id)}
                className="w-full px-4 py-3 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 font-medium"
              >
                Start Sharing Location
              </button>
            )}
            <button
              onClick={() => handleMarkDelivered(delivery.id)}
              disabled={markDeliveredPending}
              className="w-full px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
