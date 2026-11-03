import { Truck, Flower2, Gift, ShieldCheck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Truck,
    label: "Same-Day Delivery",
    description: "Fast & reliable",
  },
  {
    id: 2,
    icon: Flower2,
    label: "100% Fresh Flowers",
    description: "Always fresh",
  },
  { id: 3, icon: Gift, label: "Custom Gifts", description: "Personalized" },
  {
    id: 4,
    icon: ShieldCheck,
    label: "Product Guarantee",
    description: "Quality assured",
  },
];

export function USPSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="grid grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-6 bg-[#F9FAFB] rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#E91E8C] to-[#FF1F8F] rounded-full flex items-center justify-center shadow-md">
                    <Icon size={28} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[#1F2937]">{feature.label}</p>
                  <p className="text-[#6B7280] text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
