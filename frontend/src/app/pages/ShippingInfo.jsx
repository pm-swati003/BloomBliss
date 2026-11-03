import { Truck, Clock, MapPin, Package, Shield } from "lucide-react";

const sections = [
  {
    icon: Truck,
    title: "Delivery areas",
    text: "We deliver across our service regions. Enter your address at checkout to check availability and delivery dates.",
  },
  {
    icon: Clock,
    title: "Delivery times",
    text: "Choose your preferred delivery date and time slot at checkout. We offer morning and afternoon slots where available. Same-day delivery may be available in select areas.",
  },
  {
    icon: Package,
    title: "Packaging",
    text: "Your flowers are carefully packed to stay fresh during transit. Bouquets are delivered in water or protective packaging so they arrive in great condition.",
  },
  {
    icon: MapPin,
    title: "Tracking",
    text: "Once your order is shipped, you’ll receive a tracking number. View order status and tracking in your Profile under Order History.",
  },
  {
    icon: Shield,
    title: "Care & guarantees",
    text: "We source fresh blooms and handle them with care. If you receive damaged or incorrect items, contact us within 48 hours and we’ll make it right.",
  },
];

export function ShippingInfo() {
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Shipping & Delivery
          </h1>
          <p className="text-white/90">How we get your blooms to you</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-20 py-12 space-y-8">
        {sections.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-white rounded-xl shadow-lg p-6 border border-[#E5E7EB] flex gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#E91E8C]/10 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-[#E91E8C]" />
            </div>
            <div>
              <h2 className="text-[#1F2937] font-semibold mb-2">{title}</h2>
              <p className="text-[#6B7280]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
