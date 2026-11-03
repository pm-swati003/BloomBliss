import { Navigation, AlertCircle } from "lucide-react";

export function LocationSharingBanner({ locationSharing, currentLocation, locationError, stopLocationSharing }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              locationSharing ? "bg-[#10B981] animate-pulse" : "bg-[#6B7280]"
            }`}
          >
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[#1F2937] mb-1 font-bold">
              {locationSharing ? "Location Sharing Active" : "Location Sharing Inactive"}
            </h3>
            <p className="text-[#6B7280] text-sm">
              {locationSharing
                ? "Customers can track your real-time location"
                : "Start delivery on an order below to share location"}
            </p>
            {currentLocation && (
              <p className="text-[#E91E8C] text-sm mt-2 font-mono">
                Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)}
              </p>
            )}
            {locationError && (
              <p className="text-[#EF4444] text-sm mt-2 flex items-center font-medium">
                <AlertCircle className="w-4 h-4 mr-1" />
                {locationError}
              </p>
            )}
          </div>
        </div>
        {locationSharing ? (
          <button
            onClick={stopLocationSharing}
            className="px-6 py-3 rounded-lg bg-[#6B7280] text-white hover:bg-[#4B5563] transition-all whitespace-nowrap font-medium"
          >
            Stop Sharing
          </button>
        ) : (
          <span className="text-[#6B7280] text-sm italic">
            Select an order and click "Start Sharing Location"
          </span>
        )}
      </div>
    </div>
  );
}
