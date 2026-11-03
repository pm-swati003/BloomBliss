import { Plus, Pencil, Trash2 } from "lucide-react";

export function CouponsTab({
  coupons,
  loadingCoupons,
  openNewCoupon,
  openEditCoupon,
  handleDeleteCoupon,
}) {
  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={openNewCoupon}
          className="flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
        >
          <Plus className="w-5 h-5" />
          Add coupon
        </button>
      </div>
      {loadingCoupons ? (
        <p className="text-[#6B7280] py-8">Loading coupons...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">Code</th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">Type</th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">Value</th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">
                  Subscribers only
                </th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">Used</th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">
                  Active
                </th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6B7280]">
                    No coupons. Create one to offer discounts (e.g. subscriber-only codes).
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#FFF5F7]/50"
                  >
                    <td className="py-3 px-2 font-mono">{c.code}</td>
                    <td className="py-3 px-2">{c.discount_type}</td>
                    <td className="py-3 px-2">
                      {c.discount_type === "percent" ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="py-3 px-2">{c.for_subscribers_only ? "Yes" : "No"}</td>
                    <td className="py-3 px-2">
                      {c.used_count}
                      {c.usage_limit != null ? ` / ${c.usage_limit}` : ""}
                    </td>
                    <td className="py-3 px-2">{c.is_active ? "Yes" : "No"}</td>
                    <td className="py-3 px-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCoupon(c)}
                        className="text-[#E91E8C] hover:underline flex items-center gap-1"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
