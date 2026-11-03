import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle,
  DollarSign,
  MapPin,
  Clock,
} from "lucide-react";
import { useDeliveryOrders } from "@/lib/api/hooks/useDelivery";
import { formatINR } from "@/lib/utils/currency";

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

export function DeliveryHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: deliveredOrders = [], isLoading } =
    useDeliveryOrders("delivered");

  const filtered = deliveredOrders.filter(
    (d) =>
      (d.order_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.customer_name || d.customer || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (d.product_summary || d.product || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const totalDeliveries = filtered.length;
  const totalEarnings = filtered.reduce(
    (sum, o) => sum + (parseFloat(o.delivery_earnings) || 150),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white mb-2 text-3xl font-bold font-sans">
                Delivery History
              </h1>
              <p className="text-white/90 font-medium">View your past deliveries and earnings</p>
            </div>
            <Link
              to="/delivery/dashboard"
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">
              Completed Deliveries
            </h3>
            <p className="text-[#1F2937] text-2xl font-bold">{totalDeliveries}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-[#E91E8C]" />
            </div>
            <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">
              Total History Payout
            </h3>
            <p className="text-[#1F2937] text-2xl font-bold">
              {formatINR(totalEarnings)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-[#6B7280] py-8 text-center font-medium animate-pulse">
              Loading deliveries...
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
              <h3 className="text-[#6B7280] mb-2 font-sans font-bold text-lg">
                No deliveries found
              </h3>
              <p className="text-[#6B7280] text-sm">
                Try adjusting your search or complete more deliveries first.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border-2 border-[#E5E7EB] rounded-lg p-6 hover:border-[#E91E8C] transition-all duration-300 bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-[#1F2937] mb-0.5 font-sans font-bold text-lg">
                            {delivery.order_number}
                          </h3>
                          <p className="text-[#6B7280] text-sm font-medium">
                            {formatDeliveryDate(delivery.delivery_date)}
                            {delivery.delivery_time ? ` • ${delivery.delivery_time}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                        <div>
                          <p className="text-[#6B7280] text-sm mb-0.5 font-medium">
                            Customer
                          </p>
                          <p className="text-[#374151] font-semibold">
                            {delivery.customer_name || delivery.customer || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#6B7280] text-sm mb-0.5 font-medium">Product</p>
                          <p className="text-[#374151] font-semibold">
                            {delivery.product_summary || delivery.product || "Flower Bouquet"}
                          </p>
                        </div>
                      </div>
                      {delivery.address && (
                        <div className="mt-3 flex items-center text-[#6B7280] text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-[#E91E8C] shrink-0" />
                          <span>{delivery.address.full}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right lg:border-l lg:border-gray-100 lg:pl-6">
                      <p className="text-[#6B7280] text-xs mb-1 font-medium">Your Payout</p>
                      <p className="text-[#10B981] font-bold text-xl">
                        {formatINR(delivery.delivery_earnings || 150)}
                      </p>
                      <p className="text-[#9CA3AF] text-xs mt-1">
                        Order total: {formatINR(delivery.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
