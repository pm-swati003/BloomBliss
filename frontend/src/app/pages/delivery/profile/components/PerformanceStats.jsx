import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

export function PerformanceStats({
  totalDeliveries,
  completedToday,
  pending,
  completionRate,
  totalEarnings,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-[#1F2937] mb-6 text-xl font-bold font-sans">
          Performance Stats
        </h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B7280] text-sm font-medium">Total Deliveries</p>
              <p className="text-[#E91E8C] font-bold">{totalDeliveries}</p>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div
                className="bg-[#E91E8C] h-2 rounded-full transition-all duration-300"
                style={{
                  width:
                    totalDeliveries > 0
                      ? `${Math.min(100, (completedToday / totalDeliveries) * 100)}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B7280] text-sm font-medium">Completed Today</p>
              <p className="text-[#10B981] font-bold">{completedToday}</p>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div
                className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#6B7280] text-sm font-medium">Pending</p>
              <p className="text-[#374151] font-bold">{pending}</p>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div
                className="bg-[#9333EA] h-2 rounded-full transition-all duration-300"
                style={{
                  width:
                    totalDeliveries > 0
                      ? `${Math.min(100, (pending / totalDeliveries) * 100)}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center mb-4">
          <DollarSign className="w-8 h-8 text-white mr-3" />
          <h2 className="text-white text-xl font-bold font-sans">Total Earnings</h2>
        </div>
        <p className="text-white mb-6 text-3xl font-bold font-sans">
          {formatINR(totalEarnings || 0)}
        </p>
        <Link
          to="/delivery/history"
          className="block w-full px-4 py-3 bg-white text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all duration-300 font-semibold text-center shadow-sm"
        >
          View Earnings Details
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-[#1F2937] mb-6 text-xl font-bold font-sans">Quick Links</h2>
        <div className="space-y-3">
          <Link
            to="/delivery/active"
            className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 font-medium text-center"
          >
            Active Deliveries
          </Link>
          <Link
            to="/delivery/history"
            className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 font-medium text-center"
          >
            Delivery History
          </Link>
          <Link
            to="/contact"
            className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 font-medium text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
