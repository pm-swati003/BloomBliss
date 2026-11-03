import { User, Phone, Star } from "lucide-react";
import { useAdminOrderTracking } from "@/lib/api/hooks/useAdmin";
import { TrackingMap } from "@/app/components/TrackingMap";

export function OrderTrackingModal({
  orderId,
  orderNumber,
  onClose,
  showOverrideForm,
  setShowOverrideForm,
  overrideForm,
  setOverrideForm,
  onSaveOverride,
  updateTracking,
}) {
  const { data: tracking, isLoading } = useAdminOrderTracking(orderId, {
    refetchInterval: 10000,
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1F2937]">Live tracking</h2>
              <p className="text-[#6B7280] text-sm">
                Order {orderNumber} · Updates every 10s
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {isLoading && !tracking ? (
            <div className="py-12 text-center text-[#6B7280]">Loading tracking...</div>
          ) : tracking ? (
            <>
              {tracking.rider && (
                <div className="mb-4 rounded-xl border-2 border-[#F3E8FF] bg-[#FAF5FF] p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E91E8C] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-[#9333EA]">
                        Delivery person
                      </p>
                      <p className="font-semibold text-[#1F2937]">{tracking.rider.name}</p>
                      {tracking.rider.phone && (
                        <a
                          href={`tel:${tracking.rider.phone}`}
                          className="text-sm text-[#E91E8C] flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" /> {tracking.rider.phone}
                        </a>
                      )}
                      {tracking.rider.rating != null && (
                        <p className="flex items-center gap-1 text-sm text-amber-600 mt-0.5">
                          <Star className="w-4 h-4 fill-amber-400" />{" "}
                          {Number(tracking.rider.rating).toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 rounded-xl overflow-hidden" style={{ minHeight: 320 }}>
                <TrackingMap
                  riderLat={tracking.rider_lat}
                  riderLng={tracking.rider_lng}
                  status={tracking.status}
                  currentStepLabel={tracking.steps?.[tracking.current_step_index]?.label}
                  shopAddress={tracking.shop_address}
                  shopLat={tracking.shop_lat}
                  shopLng={tracking.shop_lng}
                  deliveryAddress={tracking.delivery_address}
                  deliveryLat={tracking.delivery_lat}
                  deliveryLng={tracking.delivery_lng}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowOverrideForm(!showOverrideForm)}
                  className="text-sm text-[#6B7280] hover:text-[#E91E8C] underline"
                >
                  {showOverrideForm ? "Hide override" : "Override location & ETA (manual)"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
                >
                  Close
                </button>
              </div>

              {showOverrideForm && (
                <div className="mt-4 p-4 border border-[#E5E7EB] rounded-lg space-y-3">
                  <p className="text-sm text-[#6B7280]">
                    Manually set rider coordinates and ETA if needed.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Rider latitude"
                      value={overrideForm.riderLat}
                      onChange={(e) =>
                        setOverrideForm((f) => ({ ...f, riderLat: e.target.value }))
                      }
                      className="px-3 py-2 border border-[#E5E7EB] rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Rider longitude"
                      value={overrideForm.riderLng}
                      onChange={(e) =>
                        setOverrideForm((f) => ({ ...f, riderLng: e.target.value }))
                      }
                      className="px-3 py-2 border border-[#E5E7EB] rounded-lg"
                    />
                  </div>
                  <input
                    type="datetime-local"
                    value={overrideForm.estimatedAt}
                    onChange={(e) =>
                      setOverrideForm((f) => ({ ...f, estimatedAt: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={onSaveOverride}
                    disabled={updateTracking.isPending}
                    className="px-4 py-2 bg-[#9333EA] text-white rounded-lg hover:bg-[#7E22CE] disabled:opacity-50"
                  >
                    {updateTracking.isPending ? "Saving..." : "Save override"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-[#6B7280]">Could not load tracking.</div>
          )}
        </div>
      </div>
    </div>
  );
}
