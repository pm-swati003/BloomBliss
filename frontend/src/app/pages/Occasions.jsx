import { Heart, Home, Sparkles, Gift, Users, Baby } from "lucide-react";
import { Link } from "react-router-dom";
import { useOccasions } from "@/lib/api/hooks/useOccasions";
import { useProducts } from "@/lib/api/hooks/useProducts";
import { OccasionBanner } from "../components/OccasionBanner";

function FeaturedCollectionCard({ to, image, title, description, buttonText }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden border border-[#E5E7EB] hover:border-[#E91E8C] transition-all"
    >
      <div className="w-full h-64 bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl">🌸</span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-[#1F2937] mb-2 group-hover:text-[#E91E8C] font-semibold text-lg transition-colors">
          {title}
        </h3>
        <p className="text-[#6B7280] mb-6 text-sm">{description}</p>
        <button className="w-full py-3 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] text-white rounded-lg hover:shadow-md transition-all">
          {buttonText}
        </button>
      </div>
    </Link>
  );
}

const occasionIcons = {
  wedding: Heart,
  anniversary: Sparkles,
  housewarming: Home,
  sympathy: Users,
  birthday: Gift,
  "new-baby": Baby,
};

const occasionColors = {
  wedding: "bg-[#E91E8C]",
  anniversary: "bg-[#9333EA]",
  housewarming: "bg-[#10B981]",
  sympathy: "bg-[#6B7280]",
  birthday: "bg-[#FF1F8F]",
  "new-baby": "bg-[#F472B6]",
};

export function Occasions() {
  const { data: occasionsData, isLoading } = useOccasions();
  const { data: rosesProductsData } = useProducts({
    category: "roses",
    per_page: 3,
  });
  const { data: liliesProductsData } = useProducts({
    category: "lilies",
    per_page: 3,
  });

  const occasions = Array.isArray(occasionsData)
    ? occasionsData
    : occasionsData?.data || [];
  const rosesProducts = Array.isArray(rosesProductsData)
    ? rosesProductsData
    : rosesProductsData?.data || [];
  const liliesProducts = Array.isArray(liliesProductsData)
    ? liliesProductsData
    : liliesProductsData?.data || [];

  const featuredOccasions = occasions.filter((occ) =>
    [
      "wedding",
      "anniversary",
      "housewarming",
      "sympathy",
      "birthday",
      "new-baby",
    ].includes(occ.slug),
  );

  const valentinesImage =
    rosesProducts[0]?.image ||
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=60";
  const mothersDayImage =
    liliesProducts[0]?.image ||
    rosesProducts[0]?.image ||
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=60";
  const corporateImage =
    rosesProducts[0]?.image ||
    liliesProducts[0]?.image ||
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=60";

  const collections = [
    {
      to: "/collections/valentines-day",
      image: valentinesImage,
      title: "Valentine's Day Special",
      description: "Show your love with roses",
      buttonText: "Shop Valentine's",
    },
    {
      to: "/collections/mothers-day",
      image: mothersDayImage,
      title: "Mother's Day Collection",
      description: "Honor the special women in your life",
      buttonText: "Browse Collection",
    },
    {
      to: "/collections/corporate-gifting",
      image: corporateImage,
      title: "Corporate Gifting",
      description: "Professional arrangements for business",
      buttonText: "View Options",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E8C] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading occasions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#E91E8C] via-[#FF1F8F] to-[#9333EA] py-16">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <h1 className="text-white mb-4">Flowers for Every Occasion</h1>
          <p className="text-white/90">
            Find the perfect blooms to celebrate life's special moments
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-20 py-20">
        {/* Browse by Occasion */}
        <h2 className="text-[#1F2937] mb-12 text-center text-3xl font-bold">
          Browse by Occasion
        </h2>
        {featuredOccasions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">
              No occasions found. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 mb-20">
            {featuredOccasions.map((occ) => {
              const Icon = occasionIcons[occ.slug] || Heart;
              const color = occasionColors[occ.slug] || "bg-[#E91E8C]";
              return (
                <Link
                  key={occ.id}
                  to={`/occasions/${occ.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-8 border border-[#E5E7EB] hover:border-[#E91E8C]"
                >
                  <div
                    className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-[#1F2937] font-semibold text-lg mb-2 group-hover:text-[#E91E8C] transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-[#6B7280] mb-6 text-sm">
                    {occ.description}
                  </p>
                  <span className="text-[#E91E8C] text-sm font-medium group-hover:underline">
                    Browse {occ.name} Flowers →
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Featured Collections */}
        <h2 className="text-[#1F2937] mb-12 text-center text-3xl font-bold">
          Featured Collections
        </h2>
        <div className="grid grid-cols-3 gap-8 mb-20">
          {collections.map((col, idx) => (
            <FeaturedCollectionCard key={idx} {...col} />
          ))}
        </div>

        {/* Occasion Banner */}
        <OccasionBanner />

        {/* CTA Section */}
        <div className="w-full bg-[#FFF5F7] py-20 mt-20">
          <div className="max-w-[1440px] mx-auto px-20 text-center">
            <h2 className="text-[#E91E8C] mb-4 text-3xl font-bold">
              Need Help Choosing?
            </h2>
            <p className="text-[#6B7280] mb-8 max-w-2xl mx-auto">
              Our floral experts are here to help you find the perfect
              arrangement for your occasion
            </p>
            <Link
              to="/contact"
              className="px-8 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors shadow-md inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
