import { ChevronRight } from "lucide-react";
import { getAvailableTimeSlotsForDate } from "../hooks/useCheckoutLogic";

export function ShippingForm({
  addresses,
  isAddressesLoading,
  selectedAddressId,
  setSelectedAddressId,
  isCreatingNewAddress,
  setIsCreatingNewAddress,
  newAddress,
  setNewAddress,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  availableTimeSlots,
  isDeliveryDateToday,
  handleShippingSubmit,
  DELIVERY_SLOTS,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937]">Shipping Address</h2>
        <button
          onClick={() => setIsCreatingNewAddress(!isCreatingNewAddress)}
          className="px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7]"
        >
          {isCreatingNewAddress ? "Select Existing" : "+ Add New Address"}
        </button>
      </div>
      <form onSubmit={handleShippingSubmit}>
        {!isCreatingNewAddress ? (
          <div className="space-y-4 mb-6">
            {isAddressesLoading ? (
              <p className="text-[#6B7280]">Loading addresses...</p>
            ) : addresses.length > 0 ? (
              addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? "border-[#E91E8C] bg-[#FFF5F7]"
                      : "border-[#E5E7EB] hover:border-[#E91E8C]"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-semibold text-[#1F2937]">{addr.name}</p>
                    <p className="text-[#6B7280]">{addr.street}</p>
                    <p className="text-[#6B7280]">
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p className="text-[#6B7280]">{addr.phone}</p>
                    {addr.is_default && (
                      <span className="inline-block mt-2 px-2 py-1 bg-[#9333EA] text-white text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <p className="text-[#6B7280]">No addresses found. Please add one.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-[#374151] mb-2">Address Type</label>
              <select
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Street Address *</label>
              <input
                type="text"
                required
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#374151] mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#374151] mb-2">State *</label>
                <input
                  type="text"
                  required
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#374151] mb-2">ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#374151] mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
          <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Delivery Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#374151] mb-2">Preferred Delivery Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={deliveryDate}
                onChange={(e) => {
                  const date = e.target.value;
                  setDeliveryDate(date);
                  const avail = getAvailableTimeSlotsForDate(date);
                  if (deliveryTime && !avail.includes(deliveryTime)) setDeliveryTime("");
                }}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Delivery Time *</label>
              <select
                required
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              >
                <option value="">Select time</option>
                {DELIVERY_SLOTS.map((slot) => (
                  <option
                    key={slot.value}
                    value={slot.value}
                    disabled={!availableTimeSlots.includes(slot.value)}
                  >
                    {slot.label}
                    {!availableTimeSlots.includes(slot.value) && isDeliveryDateToday
                      ? " (unavailable for today)"
                      : ""}
                  </option>
                ))}
              </select>
              {deliveryDate && availableTimeSlots.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No delivery slots left for this date. Please select another day.
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 px-6 py-4 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all group flex items-center justify-center gap-2"
        >
          Continue to Payment
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
