import { ChevronRight } from "lucide-react";

export function PaymentForm({
  paymentMethods,
  isPaymentMethodsLoading,
  selectedPaymentMethodId,
  setSelectedPaymentMethodId,
  isCreatingNewPayment,
  setIsCreatingNewPayment,
  newPayment,
  setNewPayment,
  handlePaymentSubmit,
  setCurrentStep,
}) {
  const formatCardNumber = (v) => {
    const match = v.replace(/\s/g, "").match(/\d{4,16}/g);
    if (match) return match[0].match(/.{1,4}/g).join(" ");
    return v;
  };
  
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "");
    if (d.length >= 2) return d.slice(0, 2) + "/" + d.slice(2, 4);
    return d;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937]">Payment Method</h2>
        <button
          onClick={() => setIsCreatingNewPayment(!isCreatingNewPayment)}
          className="px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7]"
        >
          {isCreatingNewPayment ? "Select Existing" : "+ Add New Card"}
        </button>
      </div>
      <form onSubmit={handlePaymentSubmit}>
        {!isCreatingNewPayment ? (
          <div className="space-y-4 mb-6">
            {isPaymentMethodsLoading ? (
              <p className="text-[#6B7280]">Loading payment methods...</p>
            ) : paymentMethods.length > 0 ? (
              paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethodId === pm.id
                      ? "border-[#E91E8C] bg-[#FFF5F7]"
                      : "border-[#E5E7EB] hover:border-[#E91E8C]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={selectedPaymentMethodId === pm.id}
                    onChange={() => setSelectedPaymentMethodId(pm.id)}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-semibold text-[#1F2937]">
                      {pm.type} •••• {pm.last4}
                    </p>
                    <p className="text-[#6B7280] text-sm">
                      Expires {pm.expiry} • {pm.name}
                    </p>
                    {pm.is_default && (
                      <span className="inline-block mt-2 px-2 py-1 bg-[#9333EA] text-white text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <p className="text-[#6B7280]">No payment methods found. Please add one.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-[#374151] mb-2">Card Type</label>
              <select
                value={newPayment.type}
                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              >
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
                <option>Discover</option>
              </select>
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Card Number *</label>
              <input
                type="text"
                required
                value={newPayment.cardNumber}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, cardNumber: formatCardNumber(e.target.value) })
                }
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-2">Cardholder Name *</label>
              <input
                type="text"
                required
                value={newPayment.cardName}
                onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#374151] mb-2">Expiry Date *</label>
                <input
                  type="text"
                  required
                  value={newPayment.expiryDate}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, expiryDate: formatExpiry(e.target.value) })
                  }
                  maxLength={5}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
              <div>
                <label className="block text-[#374151] mb-2">CVV *</label>
                <input
                  type="text"
                  required
                  value={newPayment.cvv}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, cvv: e.target.value.replace(/\D/g, "") })
                  }
                  maxLength={4}
                  placeholder="123"
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex-1 px-6 py-4 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7]"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-4 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all group flex items-center justify-center gap-2"
          >
            Review Order
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
