export function AddressStep({ addressInfo, setAddressInfo, handleAddressSubmit, setCurrentStep, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Shipping Address</h2>
      <form onSubmit={handleAddressSubmit} className="space-y-6">
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Address Type</label>
          <select
            value={addressInfo.type}
            onChange={(e) => setAddressInfo({ ...addressInfo, type: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none bg-white"
          >
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Full Name *</label>
          <input
            type="text"
            required
            value={addressInfo.name}
            onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <div>
          <label className="block text-[#374151] mb-2 font-medium">Street Address *</label>
          <input
            type="text"
            required
            value={addressInfo.street}
            onChange={(e) => setAddressInfo({ ...addressInfo, street: e.target.value })}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">City *</label>
            <input
              type="text"
              required
              value={addressInfo.city}
              onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">State *</label>
            <input
              type="text"
              required
              value={addressInfo.state}
              onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#374151] mb-2 font-medium">ZIP Code *</label>
            <input
              type="text"
              required
              value={addressInfo.zip}
              onChange={(e) => setAddressInfo({ ...addressInfo, zip: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-2 font-medium">Phone *</label>
            <input
              type="tel"
              required
              value={addressInfo.phone}
              onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex-1 px-6 py-3 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
