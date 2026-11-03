import { useAdminDashboardLogic } from "./hooks/useAdminDashboardLogic";
import { StatCards } from "./components/StatCards";
import { DeliveriesDue } from "./components/DeliveriesDue";
import { RecentOrders } from "./components/RecentOrders";
import { LowStock } from "./components/LowStock";

export function AdminDashboard() {
  const {
    stats,
    statsLoading,
    recentOrders,
    ordersLoading,
    lowStock,
    lowStockLoading,
    deliveriesDueToday,
    dueLoading,
  } = useAdminDashboardLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-white/90">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <DeliveriesDue deliveriesDueToday={deliveriesDueToday} dueLoading={dueLoading} />

        <StatCards stats={stats} statsLoading={statsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentOrders recentOrders={recentOrders} ordersLoading={ordersLoading} />
          <LowStock lowStock={lowStock} lowStockLoading={lowStockLoading} />
        </div>
      </div>
    </div>
  );
}
