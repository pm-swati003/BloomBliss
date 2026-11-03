export function OrderReview({
  addresses,
  selectedAddressId,
  paymentMethods,
  selectedPaymentMethodId,
  deliveryDate,
  deliveryTime,
  total,
  setCurrentStep,
  handlePlaceOrder,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
        <div className="mb-6 pb-6 border-b">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">Shipping Address</h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-[#E91E8C] hover:underline"
            >
              Edit
            </button>
          </div>
          {selectedAddressId &&
            (() => {
              const addr = addresses.find((a) => a.id === selectedAddressId);
              return addr ? (
                <>
                  <p className="font-medium">{addr.name}</p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p>{addr.phone}</p>
                </>
              ) : (
                <p className="text-[#6B7280]">No address selected</p>
              );
            })()}
        </div>
        <div className="mb-6 pb-6 border-b">
          <h3 className="font-semibold text-lg">Delivery Details</h3>
          <p>Date: {deliveryDate || "Not selected"}</p>
          <p>Time: {deliveryTime || "Not selected"}</p>
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">Payment Method</h3>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-[#E91E8C] hover:underline"
            >
              Edit
            </button>
          </div>
          {selectedPaymentMethodId &&
            (() => {
              const pm = paymentMethods.find((p) => p.id === selectedPaymentMethodId);
              return pm ? (
                <>
                  <p>
                    {pm.type} ending in **** {pm.last4}
                  </p>
                  <p>{pm.name}</p>
                  <p className="text-sm">Expires: {pm.expiry}</p>
                </>
              ) : (
                <p className="text-[#6B7280]">No payment method selected</p>
              );
            })()}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 px-6 py-4 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7]"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] text-white rounded-lg hover:shadow-xl transition-all"
        >
          Place Order ₹{total.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
}
