import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-[#FFF5F7] via-[#FCE7F3] to-[#FFF5F7] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-20 py-20 relative z-10">
        <div className="grid grid-cols-12 gap-8 min-h-[600px] items-center">
          <div className="col-span-6 flex flex-col justify-center space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full w-fit mb-2 animate-slide-in-left">
              <Sparkles className="w-4 h-4 text-[#E91E8C]" />
              <span className="text-sm text-[#E91E8C] font-medium">
                Fresh Flowers Delivered Daily
              </span>
            </div>

            <h1 className="text-[#E91E8C] text-6xl font-bold leading-tight animate-fade-in-up delay-200">
              Spring is Here!
              <span className="block text-[#9333EA] mt-2">
                Bloom with Beauty
              </span>
            </h1>

            <p className="text-[#6B7280] text-lg leading-relaxed animate-fade-in-up delay-300">
              Same-day flower delivery to your doorstep. Express your emotions
              with our stunning collection of fresh blooms.
            </p>

            <div className="flex gap-4 pt-4 animate-fade-in-up delay-400">
              <Link
                to="/shop"
                className="group px-8 py-4 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/occasions"
                className="px-8 py-4 bg-white text-[#E91E8C] border-2 border-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Explore
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up delay-500">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#E91E8C]">500+</p>
                <p className="text-sm text-[#6B7280]">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#E91E8C]">100+</p>
                <p className="text-sm text-[#6B7280]">Flower Varieties</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#E91E8C]">24/7</p>
                <p className="text-sm text-[#6B7280]">Delivery Service</p>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex items-center justify-center animate-fade-in-right">
            <div className="relative w-full h-[550px] group">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=800&fit=crop"
                  alt="Beautiful flower bouquet"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
