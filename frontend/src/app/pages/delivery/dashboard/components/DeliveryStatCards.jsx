import { Package, CheckCircle, Wallet, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

export function DeliveryStatCards({ totalDeliveries, completed, totalEarnings, todayEarnings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#E91E8C] to-[#9333EA] flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">Total Deliveries</h3>
        <p className="text-[#1F2937] text-2xl font-bold">{totalDeliveries}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">Completed Today</h3>
        <p className="text-[#1F2937] text-2xl font-bold">{completed}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">Total Earnings</h3>
        <p className="text-[#1F2937] text-2xl font-bold">{formatINR(totalEarnings || 0)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#9333EA] to-[#7C3AED] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-[#6B7280] text-sm mb-1 font-sans font-medium">Today's Earnings</h3>
        <p className="text-[#1F2937] text-2xl font-bold">{formatINR(todayEarnings || 0)}</p>
      </div>
    </div>
  );
}
