import { Plus, Pencil, Trash2 } from "lucide-react";

export function BenefitsTab({
  benefits,
  loadingBenefits,
  benefitsDraft,
  benefitsEditing,
  startEditBenefits,
  cancelEditBenefits,
  addBenefitRow,
  updateBenefitRow,
  removeBenefitRow,
  saveBenefits,
  updateBenefits,
}) {
  return (
    <>
      <p className="text-[#6B7280] mb-6">
        List the special features and offers you give to newsletter subscribers (e.g. “10%
        off first order”, “Free shipping over ₹500”). Shown to subscribers; you can also
        create subscriber-only coupons above.
      </p>
      {loadingBenefits ? (
        <p className="text-[#6B7280] py-8">Loading...</p>
      ) : benefitsEditing ? (
        <div className="space-y-4">
          {benefitsDraft.map((b, i) => (
            <div
              key={i}
              className="flex gap-4 items-start p-4 border border-[#E5E7EB] rounded-lg"
            >
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Title (e.g. 10% off first order)"
                  value={b.title}
                  onChange={(e) => updateBenefitRow(i, "title", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={b.description ?? ""}
                  onChange={(e) => updateBenefitRow(i, "description", e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeBenefitRow(i)}
                className="text-red-600 hover:underline p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={addBenefitRow}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7]"
            >
              <Plus className="w-5 h-5" />
              Add benefit
            </button>
            <button
              type="button"
              onClick={saveBenefits}
              disabled={updateBenefits.isPending}
              className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
            >
              {updateBenefits.isPending ? "Saving..." : "Save benefits"}
            </button>
            <button
              type="button"
              onClick={cancelEditBenefits}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {benefits.length === 0 ? (
            <p className="text-[#6B7280] py-4">
              No benefits defined yet. Click “Edit benefits” to add special offers for
              subscribers.
            </p>
          ) : (
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="p-4 border border-[#E5E7EB] rounded-lg">
                  <p className="font-medium text-[#1F2937]">{b.title}</p>
                  {b.description && (
                    <p className="text-[#6B7280] text-sm mt-1">{b.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={startEditBenefits}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
          >
            <Pencil size={18} />
            {benefits.length ? "Edit benefits" : "Add benefits"}
          </button>
        </div>
      )}
    </>
  );
}
