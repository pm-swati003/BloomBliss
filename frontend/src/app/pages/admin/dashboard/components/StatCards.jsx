import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

export function StatCards({ stats, statsLoading }) {
  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          value: formatINR(stats.total_revenue ?? 0),
          change: stats.revenue_change != null ? `${stats.revenue_change >= 0 ? "+" : ""}${stats.revenue_change}%` : null,
          icon: DollarSign,
          color: "from-[#E91E8C] to-[#9333EA]",
        },
        {
          title: "Orders",
          value: (stats.orders_count ?? 0).toString(),
          change: stats.orders_change != null ? `${stats.orders_change >= 0 ? "+" : ""}${stats.orders_change}%` : null,
          icon: ShoppingBag,
          color: "from-[#9333EA] to-[#E91E8C]",
        },
        {
          title: "Customers",
          value: (stats.customers_count ?? 0).toString(),
          change: null,
          icon: Users,
          color: "from-[#E91E8C] to-[#DB1777]",
        },
        {
          title: "Products",
          value: (stats.products_count ?? 0).toString(),
          change: null,
          icon: Package,
          color: "from-[#9333EA] to-[#E91E8C]",
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statsLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-12 bg-[#E5E7EB] rounded mb-4" />
              <div className="h-4 bg-[#E5E7EB] rounded w-1/2 mb-2" />
              <div className="h-6 bg-[#E5E7EB] rounded w-2/3" />
            </div>
          ))
        : statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change != null && (
                    <span className="text-[#10B981] text-sm flex items-center font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-[#6B7280] text-sm mb-1">{stat.title}</h3>
                <p className="text-[#1F2937] text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
    </div>
  );
}
