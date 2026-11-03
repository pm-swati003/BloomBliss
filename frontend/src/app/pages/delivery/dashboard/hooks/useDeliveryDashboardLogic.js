import { useDeliveryMe, useDeliveryStats, useDeliveryOrders, deliveryLogout } from "@/lib/api/hooks/useDelivery";

export function useDeliveryDashboardLogic() {
  const { data: user } = useDeliveryMe();
  const { data: stats } = useDeliveryStats();
  const { data: activeOrders = [] } = useDeliveryOrders("active");

  const name = user?.name ?? "Delivery Partner";
  const totalDeliveries = stats?.total_deliveries ?? stats?.completed_deliveries ?? 0;
  const completed = stats?.completed_today ?? stats?.delivered_today ?? 0;
  const pending = stats?.pending ?? (activeOrders.length || 0);
  const deliveredToday = stats?.delivered_today ?? completed;
  const totalEarnings = stats?.total_earnings ?? 0;
  const todayEarnings = stats?.today_earnings ?? 0;

  return {
    name,
    totalDeliveries,
    completed,
    totalEarnings,
    todayEarnings,
    activeOrders,
    deliveryLogout,
  };
}
