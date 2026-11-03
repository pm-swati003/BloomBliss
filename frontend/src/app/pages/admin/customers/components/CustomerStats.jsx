import { formatINR } from "@/lib/utils/currency";

export function CustomerStats({ totalCustomers, activeCount, totalOrders, totalRevenue }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-[#6B7280] mb-2">Total Customers</p>
        <p className="text-[#E91E8C] text-2xl font-bold">{totalCustomers}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-[#6B7280] mb-2">Active Customers</p>
        <p className="text-[#E91E8C] text-2xl font-bold">{activeCount}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-[#6B7280] mb-2">Total Orders</p>
        <p className="text-[#E91E8C] text-2xl font-bold">{totalOrders}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-[#6B7280] mb-2">Total Revenue</p>
        <p className="text-[#E91E8C] text-2xl font-bold">{formatINR(totalRevenue)}</p>
      </div>
    </div>
  );
}
