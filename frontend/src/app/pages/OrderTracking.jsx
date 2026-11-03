import { useParams, Link, useNavigate } from "react-router-dom";
import { useOrderTracking } from "@/lib/api/hooks/useOrders";
import { StepProgress } from "@/app/components/StepProgress";
import { TrackingMap } from "@/app/components/TrackingMap";
import { ETACountdown } from "@/app/components/ETACountdown";
import { ArrowLeft, MapPin, Phone, Star, User } from "lucide-react";

export function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id ? parseInt(id, 10) : 0;
  const {
    data: tracking,
    isLoading,
    isError,
  } = useOrderTracking(orderId, { refetchInterval: 10000 });
  if (isLoading)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <p>Loading live tracking...</p>
      </div>
    );
  if (isError || !tracking)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div>
          <p>Unable to load tracking</p>
          <Link to={`/orders/${orderId}`} className="text-[#E91E8C]">
            Back to order
          </Link>
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-[#FFF5F7] py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C]"
        >
          <ArrowLeft size={20} />
          Back to order
        </button>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <h1 className="text-xl font-bold mb-1">Live tracking</h1>
          <p className="text-sm text-[#6B7280] mb-6">{tracking.order_number}</p>
          <StepProgress
            steps={tracking.steps}
            currentStepIndex={tracking.current_step_index}
            className="mb-8"
          />
          {tracking.estimated_delivery_at &&
            tracking.status !== "delivered" &&
            tracking.status !== "cancelled" && (
              <div className="mb-6">
                <ETACountdown estimatedAt={tracking.estimated_delivery_at} />
              </div>
            )}
          {tracking.rider &&
            (tracking.status === "shipped" ||
              tracking.status === "processing" ||
              tracking.status === "delivered") && (
              <div className="mb-6 rounded-xl border-2 border-[#F3E8FF] bg-[#FAF5FF] p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E91E8C] flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-[#9333EA]">
                      Delivery partner
                    </p>
                    <p className="font-semibold">{tracking.rider.name}</p>
                    {tracking.rider.phone ? (
                      <a
                        href={`tel:${tracking.rider.phone}`}
                        className="flex items-center gap-1.5 text-sm text-[#E91E8C] hover:underline mt-1"
                      >
                        {tracking.rider.phone}
                      </a>
                    ) : (
                      <p className="text-sm">Contact not shared</p>
                    )}
                    {tracking.rider.rating != null && (
                      <p className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {Number(tracking.rider.rating).toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
                {tracking.rider.phone && (
                  <a
                    href={`tel:${tracking.rider.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] font-medium"
                  >
                    Call to enquire
                  </a>
                )}
              </div>
            )}
          <div className="mb-4">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin size={20} className="text-[#E91E8C]" />
              Map
            </h2>
            <TrackingMap
              riderLat={tracking.rider_lat}
              riderLng={tracking.rider_lng}
              status={tracking.status}
              currentStepLabel={
                tracking.steps?.[tracking.current_step_index]?.label
              }
              shopAddress={tracking.shop_address}
              shopLat={tracking.shop_lat}
              shopLng={tracking.shop_lng}
              deliveryAddress={tracking.delivery_address}
              deliveryLat={tracking.delivery_lat}
              deliveryLng={tracking.delivery_lng}
              className="w-full"
            />
          </div>
          {tracking.delivery_address && (
            <div className="rounded-lg bg-[#F9FAFB] p-4 text-sm">
              <p className="font-medium mb-1">Delivery address</p>
              <p>{tracking.delivery_address.street}</p>
              <p>
                {tracking.delivery_address.city},{" "}
                {tracking.delivery_address.state}{" "}
                {tracking.delivery_address.zip}
              </p>
            </div>
          )}
          <p className="text-xs text-[#9CA3AF] mt-4">
            Location updates every 10 seconds. Out for delivery when status is
            "Out for delivery".
          </p>
        </div>
      </div>
    </div>
  );
}
