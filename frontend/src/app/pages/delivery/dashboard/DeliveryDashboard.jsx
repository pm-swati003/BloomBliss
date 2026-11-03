import { Link } from "react-router-dom";
import { MapPin, LogOut } from "lucide-react";
import { useDeliveryDashboardLogic } from "./hooks/useDeliveryDashboardLogic";
import { DeliveryStatCards } from "./components/DeliveryStatCards";
import { RecentActiveDeliveries } from "./components/RecentActiveDeliveries";

export function DeliveryDashboard() {
  const {
    name,
    totalDeliveries,
    completed,
    totalEarnings,
    todayEarnings,
    activeOrders,
    deliveryLogout,
  } = useDeliveryDashboardLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white mb-2 text-3xl font-bold font-sans">Delivery Dashboard</h1>
              <p className="text-white/90 font-medium">Welcome back, {name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/delivery/active"
                className="px-6 py-3 bg-white text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all duration-300 flex items-center gap-2 font-bold shadow-sm"
              >
                <MapPin className="w-5 h-5" />
                View Active Deliveries
              </Link>
              <button
                type="button"
                onClick={deliveryLogout}
                className="px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <DeliveryStatCards
          totalDeliveries={totalDeliveries}
          completed={completed}
          totalEarnings={totalEarnings}
          todayEarnings={todayEarnings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentActiveDeliveries activeOrders={activeOrders} />

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-[#1F2937] mb-6 text-xl font-bold font-sans">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/delivery/active"
                  className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 text-center font-medium"
                >
                  View Active Deliveries
                </Link>
                <Link
                  to="/delivery/history"
                  className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 text-center font-medium"
                >
                  View History
                </Link>
                <Link
                  to="/delivery/profile"
                  className="block w-full px-4 py-3 bg-[#FFF5F7] text-[#374151] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300 text-center font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
