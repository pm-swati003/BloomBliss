import {
  useAdminStats,
  useAdminRecentOrders,
  useAdminLowStock,
  useAdminDeliveriesDueToday,
} from "@/lib/api/hooks/useAdmin";

export function useAdminDashboardLogic() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentOrders, isLoading: ordersLoading } = useAdminRecentOrders();
  const { data: lowStock, isLoading: lowStockLoading } = useAdminLowStock(20);
  const { data: deliveriesDueToday = [], isLoading: dueLoading } = useAdminDeliveriesDueToday();

  return {
    stats,
    statsLoading,
    recentOrders,
    ordersLoading,
    lowStock,
    lowStockLoading,
    deliveriesDueToday,
    dueLoading,
  };
}
