export function PaymentStep({ paymentInfo, setPaymentInfo, handlePaymentSubmit, setCurrentStep, loading, formatCardNumber, formatExpiry }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Payment Method</h2>
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Card Type</label>
          <select
            value={paymentInfo.type}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, type: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none bg-white"
          >
            <option>Visa</option>
            <option>Mastercard</option>
            <option>American Express</option>
            <option>Discover</option>
          </select>
        </div>
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Card Number *</label>
          <input
            type="text"
            required
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Cardholder Name *</label>
          <input
            type="text"
            required
            value={paymentInfo.cardName}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Expiry Date *</label>
            <input
              type="text"
              required
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: formatExpiry(e.target.value) })}
              maxLength={5}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">CVV *</label>
            <input
              type="text"
              required
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, "") })}
              maxLength={4}
              placeholder="123"
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="flex-1 px-6 py-3 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all font-semibold disabled:opacity-50"
          >
            {loading ? "Completing..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
