import { ValueCard } from "../components/ValueCard";
import { TeamMemberCard } from "../components/TeamMemberCard";
import { valuesData, teamData } from "../data/aboutData";

export function About() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#E91E8C] via-[#FF1F8F] to-[#9333EA] py-20">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <h1 className="text-white mb-6">About Bloom & Bliss</h1>
          <p className="text-white/90 max-w-3xl mx-auto">
            Since 2015, we've been dedicated to bringing joy through the art of
            flowers. Our passion for beautiful blooms and commitment to
            excellence has made us a trusted name in floral design and delivery.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-20 py-20">
        {/* Our Story */}
        <div className="grid grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-[#E91E8C] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#6B7280]">
              <p>
                Bloom & Bliss was born from a simple belief: that flowers have
                the power to transform moments into memories. What started as a
                small neighborhood flower shop has grown into a beloved floral
                destination serving thousands of customers.
              </p>
              <p>
                Our team of passionate florists combines traditional
                craftsmanship with modern design sensibilities to create
                arrangements that are both timeless and contemporary. Every
                bouquet we create is a work of art, carefully crafted to express
                the emotions and sentiments of our customers.
              </p>
              <p>
                We partner with local and international growers who share our
                commitment to quality and sustainability, ensuring that every
                bloom we use is ethically sourced and environmentally
                responsible.
              </p>
            </div>
          </div>
          <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://www.identixweb.com/wp-content/uploads/2025/06/image1-3.webp"
              alt="Bloom & Bliss Flower Shop"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=600&fit=crop&q=80";
              }}
            />
          </div>
        </div>

        {/* Our Values */}
        <h2 className="text-[#1F2937] mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-4 gap-6 mb-20">
          {valuesData.map((value) => (
            <ValueCard key={value.id} {...value} />
          ))}
        </div>

        {/* Meet Our Team */}
        <h2 className="text-[#1F2937] mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamData.map((member) => (
            <TeamMemberCard key={member.id} {...member} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-[#FFF5F7] py-20">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-[#E91E8C] mb-2">50,000+</h2>
              <p className="text-[#6B7280]">Happy Customers</p>
            </div>
            <div>
              <h2 className="text-[#E91E8C] mb-2">8 Years</h2>
              <p className="text-[#6B7280]">In Business</p>
            </div>
            <div>
              <h2 className="text-[#E91E8C] mb-2">100+</h2>
              <p className="text-[#6B7280]">Flower Varieties</p>
            </div>
            <div>
              <h2 className="text-[#E91E8C] mb-2">24/7</h2>
              <p className="text-[#6B7280]">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
