import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useActiveDeliveriesLogic } from "./hooks/useActiveDeliveriesLogic";
import { LocationSharingBanner } from "./components/LocationSharingBanner";
import { ActiveOrdersList } from "./components/ActiveOrdersList";

export function ActiveDeliveries() {
  const {
    displayOrders,
    isLoading,
    locationSharing,
    currentLocation,
    locationError,
    selectedOrderId,
    startLocationSharing,
    stopLocationSharing,
    handleMarkDelivered,
    openInMaps,
    markDeliveredPending,
  } = useActiveDeliveriesLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white mb-2 text-3xl font-bold font-sans">Active Deliveries</h1>
              <p className="text-white/90 font-medium">
                Track and manage your ongoing deliveries
              </p>
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
        <LocationSharingBanner
          locationSharing={locationSharing}
          currentLocation={currentLocation}
          locationError={locationError}
          stopLocationSharing={stopLocationSharing}
        />

        {isLoading ? (
          <p className="text-[#6B7280] py-8 text-center font-medium animate-pulse">Loading orders...</p>
        ) : displayOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-[#6B7280]">
            <p className="mb-4 text-lg">No active deliveries right now.</p>
            <Link to="/delivery/dashboard" className="text-[#E91E8C] hover:underline font-medium">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <ActiveOrdersList
            displayOrders={displayOrders}
            locationSharing={locationSharing}
            selectedOrderId={selectedOrderId}
            startLocationSharing={startLocationSharing}
            stopLocationSharing={stopLocationSharing}
            handleMarkDelivered={handleMarkDelivered}
            openInMaps={openInMaps}
            markDeliveredPending={markDeliveredPending}
          />
        )}

        <div className="mt-8 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-3 text-white">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white mb-2 font-bold text-lg font-sans">Important Reminders</h3>
              <ul className="space-y-2 text-white/90 text-sm font-medium">
                <li>• Enable location sharing when starting a delivery so customers can track you</li>
                <li>• Call the customer if you can't find the address</li>
                <li>• Mark as delivered only after successful handoff</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
