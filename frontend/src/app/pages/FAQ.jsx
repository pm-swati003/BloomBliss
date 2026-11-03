import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
const faqs = [
  {
    id: 1,
    q: "How do I place an order?",
    a: "Browse our shop or occasions, add items to your cart, and proceed to checkout. You’ll need to sign in or create an account, add a delivery address and payment method, then confirm your order.",
  },
  {
    id: 2,
    q: "What are the delivery options?",
    a: "We offer standard delivery. You can choose your preferred delivery date and time slot at checkout. Same-day delivery may be available in select areas.",
  },
  {
    id: 3,
    q: "Can I modify or cancel my order?",
    a: "Contact us as soon as possible. Orders already in processing or shipped cannot be cancelled, but we can help with address changes or other issues where possible.",
  },
  {
    id: 4,
    q: "How do I track my order?",
    a: "After your order is shipped, you’ll receive a tracking number. You can view order status and tracking in your Profile under Order History.",
  },
  {
    id: 5,
    q: "What is your return or refund policy?",
    a: "We want you to be happy with your blooms. If you receive damaged or incorrect items, contact us within 48 hours with photos and we’ll arrange a replacement or refund.",
  },
  {
    id: 6,
    q: "Do you deliver on weekends and holidays?",
    a: "Yes, we deliver on most weekends and holidays. Delivery availability depends on your area and the chosen date at checkout.",
  },
];
export function FAQ() {
  const [openId, setOpenId] = useState(1);
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-white/90">Quick answers to common questions</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-20 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b last:border-0">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center gap-4 px-6 py-4 text-left hover:bg-[#FFF5F7]"
              >
                <span className="font-medium text-[#1F2937]">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-[#E91E8C] transition-transform ${openId === faq.id ? "rotate-180" : ""}`}
                />
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-[#6B7280]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[#6B7280] mt-8">
          Still have questions?{" "}
          <Link
            to="/contact"
            className="text-[#E91E8C] hover:underline font-medium"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
