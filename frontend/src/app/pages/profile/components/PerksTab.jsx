import { Gift, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function PerksTab({ perksData, isPerksLoading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Gift className="w-6 h-6 text-[#E91E8C] mr-3" />
        <h2 className="text-2xl font-bold">Subscriber Perks</h2>
      </div>
      {isPerksLoading ? (
        <p>Loading...</p>
      ) : perksData?.is_subscriber ? (
        <div className="space-y-8">
          {perksData.benefits?.length > 0 && (
            <div>
              <h3 className="text-[#374151] font-bold mb-3">Your benefits</h3>
              <p className="text-[#6B7280] text-sm mb-4">
                As a newsletter subscriber you get:
              </p>
              <ul className="space-y-3">
                {perksData.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 p-3 bg-[#FFF5F7] rounded-lg"
                  >
                    <span className="text-[#E91E8C] font-medium">•</span>
                    <div>
                      <p className="text-[#1F2937] font-medium">{b.title}</p>
                      {b.description && (
                        <p className="text-[#6B7280] text-sm mt-0.5">
                          {b.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {perksData.coupons?.length > 0 ? (
            <div>
              <h3 className="text-[#374151] font-bold mb-3">
                Your exclusive coupon codes
              </h3>
              <p className="text-[#6B7280] text-sm mb-4">
                Use these codes at checkout. Copy the code and paste it in the
                coupon field.
              </p>
              <div className="space-y-4">
                {perksData.coupons.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-3 p-4 border-2 border-[#E5E7EB] rounded-lg"
                  >
                    <code className="px-3 py-2 bg-[#F3F4F6] rounded font-mono font-bold text-[#E91E8C]">
                      {c.code}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        toast.success("Coupon code copied!");
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                    <div className="w-full text-sm text-[#6B7280] mt-1">
                      {c.discount_type === "percent"
                        ? `${c.value}% off`
                        : `₹${c.value} off`}
                      {c.min_order != null && c.min_order > 0 &&
                        ` on orders over ₹${c.min_order.toLocaleString("en-IN")}`}
                      {c.description && ` — ${c.description}`}
                      {c.valid_until &&
                        ` · Valid until ${new Date(c.valid_until).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#6B7280] text-sm mt-4">
                <Link to="/checkout" className="text-[#E91E8C] hover:underline">
                  Go to checkout
                </Link>{" "}
                and enter your code in the coupon field.
              </p>
            </div>
          ) : perksData.benefits?.length ? null : (
            <p className="text-[#6B7280]">
              No exclusive coupons right now. Check back later or subscribe on
              the home page if you haven’t.
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 bg-[#FFF5F7] rounded-lg border-2 border-[#E91E8C]/20">
          <p className="text-[#374151] font-bold mb-2">
            You’re not subscribed to our newsletter yet.
          </p>
          <p className="text-[#6B7280] text-sm mb-4">
            Subscribe on the home page (“Get Floral Updates”) to receive
            exclusive benefits and coupon codes. After subscribing, they’ll show
            here and you can use them at checkout.
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777]"
          >
            Go to home page
          </Link>
        </div>
      )}
    </div>
  );
}
