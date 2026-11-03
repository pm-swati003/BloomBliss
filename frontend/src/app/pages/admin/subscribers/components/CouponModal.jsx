export function CouponModal({
  editingCoupon,
  couponForm,
  setCouponForm,
  setCouponModalOpen,
  handleSaveCoupon,
  isPending,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
          {editingCoupon ? "Edit coupon" : "New coupon"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#374151] mb-1">Code *</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm((f) => ({
                  ...f,
                  code: e.target.value.toUpperCase().replace(/\s/g, ""),
                }))
              }
              placeholder="e.g. FLOWER10"
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              readOnly={!!editingCoupon}
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-1">Description (optional)</label>
            <input
              type="text"
              value={couponForm.description}
              onChange={(e) =>
                setCouponForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#374151] mb-1">Discount type *</label>
              <select
                value={couponForm.discount_type}
                onChange={(e) =>
                  setCouponForm((f) => ({
                    ...f,
                    discount_type: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#374151] mb-1">Value *</label>
              <input
                type="number"
                min={0}
                step={couponForm.discount_type === "percent" ? 1 : 0.01}
                value={couponForm.value}
                onChange={(e) => setCouponForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#374151] mb-1">Minimum order (₹, optional)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={couponForm.min_order}
              onChange={(e) => setCouponForm((f) => ({ ...f, min_order: e.target.value }))}
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="for_subscribers"
              checked={couponForm.for_subscribers_only}
              onChange={(e) =>
                setCouponForm((f) => ({
                  ...f,
                  for_subscribers_only: e.target.checked,
                }))
              }
              className="rounded border-[#E5E7EB] text-[#E91E8C] focus:ring-[#E91E8C]"
            />
            <label htmlFor="for_subscribers" className="text-[#374151]">
              For subscribers only
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#374151] mb-1">Valid from (optional)</label>
              <input
                type="date"
                value={couponForm.valid_from}
                onChange={(e) => setCouponForm((f) => ({ ...f, valid_from: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-1">Valid until (optional)</label>
              <input
                type="date"
                value={couponForm.valid_until}
                onChange={(e) => setCouponForm((f) => ({ ...f, valid_until: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#374151] mb-1">Usage limit (optional)</label>
            <input
              type="number"
              min={1}
              value={couponForm.usage_limit}
              onChange={(e) => setCouponForm((f) => ({ ...f, usage_limit: e.target.value }))}
              placeholder="Leave empty for unlimited"
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={couponForm.is_active}
              onChange={(e) =>
                setCouponForm((f) => ({
                  ...f,
                  is_active: e.target.checked,
                }))
              }
              className="rounded border-[#E5E7EB] text-[#E91E8C] focus:ring-[#E91E8C]"
            />
            <label htmlFor="is_active" className="text-[#374151]">
              Active
            </label>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => setCouponModalOpen(false)}
            className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCoupon}
            disabled={!couponForm.code.trim() || isPending}
            className="flex-1 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
          >
            {isPending ? "Saving..." : editingCoupon ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
