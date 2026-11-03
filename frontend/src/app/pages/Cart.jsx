import { useState } from "react";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/api/hooks/useCart";
import { useValidateCoupon } from "@/lib/api/hooks/useNewsletter";
import { useMe } from "@/lib/api/hooks/useAuth";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { toast } from "sonner";
import { CartItemRenderer } from "../components/data-renderers/CartItemRenderer";

export function Cart() {
  const { data: cartItems = [], isLoading } = useCart();
  const { data: me } = useMe();
  const { data: profileData } = useProfile();
  const userEmail = me?.email ?? profileData?.user?.email;

  const [promoCode, setPromoCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedMessage, setAppliedMessage] = useState(null);

  const validateCoupon = useValidateCoupon();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discounted_price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = Math.max(0, subtotal + shipping - appliedDiscount);

  const handleApplyCoupon = () => {
    const code = promoCode.trim();
    if (!code) {
      toast.error("Enter a promo code");
      return;
    }
    validateCoupon.mutate(
      { code, email: userEmail ?? undefined, subtotal },
      {
        onSuccess: (data) => {
          if (
            data.valid &&
            (data.discount_amount !== undefined || data.discount_amount === 0)
          ) {
            const discount = Number(data.discount_amount) || 0;
            setAppliedCouponCode(data.code ?? code);
            setAppliedDiscount(discount);
            setAppliedMessage(data.message || "Discount applied");
            toast.success(data.message || "Coupon applied");
          } else {
            setAppliedCouponCode(null);
            setAppliedDiscount(0);
            setAppliedMessage(null);
            toast.error(data.message || "Invalid coupon");
          }
        },
        onError: (err) => {
          setAppliedCouponCode(null);
          setAppliedDiscount(0);
          setAppliedMessage(null);
          const msg =
            err.response?.data?.message ??
            err.response?.data?.error ??
            "Invalid coupon.";
          toast.error(msg);
        },
      },
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    setAppliedDiscount(0);
    setAppliedMessage(null);
    setPromoCode("");
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-[#6B7280]">Loading cart...</p>
        </div>
      </div>
    );
  if (cartItems.length === 0)
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-[#E91E8C] mx-auto mb-6" />
          <h2 className="text-[#1F2937] mb-4">Your cart is empty</h2>
          <p className="text-[#6B7280] mb-8">
            Looks like you haven't added any flowers yet!
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-white mb-2">Shopping Cart</h1>
          <p className="text-white/90">{cartItems.length} items in your cart</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemRenderer key={item.id} item={item} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-[#1F2937] mb-6">Order Summary</h2>
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2">
                  <Tag className="inline-block w-4 h-4 mr-2" />
                  Promo Code
                </label>
                {appliedMessage ? (
                  <div className="flex items-center justify-between gap-2 p-3 bg-[#FFF5F7] rounded-lg border border-[#E91E8C]/30">
                    <span className="text-[#10B981] text-sm font-medium">
                      {appliedMessage}
                    </span>
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
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validateCoupon.isPending || !promoCode.trim()}
                      className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
                    >
                      {validateCoupon.isPending ? "…" : "Apply"}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#374151]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#374151]">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-[#10B981]">FREE</span>
                    ) : (
                      `₹${shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#10B981]">
                    <span>Discount</span>
                    <span>-₹{appliedDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {subtotal < 1000 && (
                  <p className="text-sm text-[#6B7280] bg-[#FFF5F7] p-3 rounded-lg">
                    💡 Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more for
                    free shipping!
                  </p>
                )}
                <div className="border-t-2 border-[#E5E7EB] pt-4">
                  <div className="flex justify-between text-[#1F2937]">
                    <span>Total</span>
                    <span className="text-[#E91E8C]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                state={
                  appliedCouponCode
                    ? { couponCode: appliedCouponCode }
                    : undefined
                }
                className="w-full block text-center px-6 py-4 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 group mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="w-full block text-center px-6 py-3 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg hover:bg-[#E91E8C] hover:text-white transition-all duration-300"
              >
                Continue Shopping
              </Link>
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-2">
                <div className="flex items-center text-[#6B7280] text-sm">
                  <span className="text-[#10B981] mr-2">✓</span>Secure checkout
                </div>
                <div className="flex items-center text-[#6B7280] text-sm">
                  <span className="text-[#10B981] mr-2">✓</span>Free returns
                  within 30 days
                </div>
                <div className="flex items-center text-[#6B7280] text-sm">
                  <span className="text-[#10B981] mr-2">✓</span>Same-day
                  delivery available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
