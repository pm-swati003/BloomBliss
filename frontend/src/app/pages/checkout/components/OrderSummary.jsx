import { Link } from "react-router-dom";
import { ShieldCheck, Package, Check } from "lucide-react";
import { toast } from "sonner";

export function OrderSummary({
  cartItems,
  perksData,
  appliedCouponMessage,
  setCouponCode,
  couponCode,
  handleApplyCoupon,
  handleRemoveCoupon,
  validateCoupon,
  subtotal,
  shipping,
  appliedDiscount,
  total,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => {
          const price = item.product?.discounted_price || item.product?.price || 0;
          return (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="text-[#374151]">{item.product?.name || "Product"}</p>
                <p className="text-sm text-[#6B7280]">Qty: {item.quantity}</p>
              </div>
              <p className="text-[#1F2937]">₹{(price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          );
        })}
      </div>

      {perksData?.is_subscriber && perksData.coupons?.length > 0 && !appliedCouponMessage && (
        <div className="py-3 border-t">
          <p className="text-sm text-[#6B7280] mb-1">Your subscriber codes:</p>
          <div className="flex flex-wrap gap-2">
            {perksData.coupons.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setCouponCode(c.code);
                  toast.success(`Code ${c.code} ready — click Apply`);
                }}
                className="px-2 py-1 text-xs font-mono bg-[#FFF5F7] text-[#E91E8C] border border-[#E91E8C]/30 rounded"
              >
                {c.code}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            <Link to="/profile?tab=perks" className="text-[#E91E8C] hover:underline">
              View all perks
            </Link>
          </p>
        </div>
      )}

      <div className="py-4 border-t">
        {appliedCouponMessage ? (
          <div className="flex justify-between items-center">
            <span className="text-[#10B981] text-sm font-medium">{appliedCouponMessage}</span>
            <button
              onClick={handleRemoveCoupon}
              className="text-[#E91E8C] text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-[#E5E7EB] rounded-lg text-sm focus:border-[#E91E8C] outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={validateCoupon.isPending || !couponCode.trim()}
              className="px-3 py-2 bg-[#E91E8C] text-white rounded-lg text-sm hover:bg-[#DB1777] disabled:opacity-50"
            >
              {validateCoupon.isPending ? "…" : "Apply"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-6 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shipping.toLocaleString("en-IN")}</span>
        </div>
        {appliedDiscount > 0 && (
          <div className="flex justify-between text-[#10B981]">
            <span>Discount</span>
            <span>-₹{appliedDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between pt-3 border-t">
          <span className="font-semibold">Total</span>
          <span className="text-[#E91E8C] font-bold">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-start text-sm text-[#6B7280]">
          <ShieldCheck className="w-5 h-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
          <span>Secure SSL encrypted payment</span>
        </div>
        <div className="flex items-start text-sm text-[#6B7280]">
          <Package className="w-5 h-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
          <span>100% satisfaction guarantee</span>
        </div>
        <div className="flex items-start text-sm text-[#6B7280]">
          <Check className="w-5 h-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
          <span>Fresh flowers delivered daily</span>
        </div>
      </div>
    </div>
  );
}
