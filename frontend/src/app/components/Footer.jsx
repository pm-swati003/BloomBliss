import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1F2937] border-t border-[#374151]">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="py-16">
          <div className="grid grid-cols-12 gap-6">
            {/* Logo Column */}
            <div className="col-span-3">
              <Link to="/">
                <h3 className="text-[#E91E8C] mb-4 hover:opacity-90 transition-opacity">
                  Bloom & Bliss
                </h3>
              </Link>
              <p className="text-[#9CA3AF]">
                Fresh blooms, delivered with love
              </p>
            </div>

            {/* Middle Links – three equal columns */}
            <div className="col-span-6">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <h4 className="text-white mb-2">Shop</h4>
                  <Link
                    to="/shop"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    All Flowers
                  </Link>
                  <Link
                    to="/occasions"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Occasions
                  </Link>
                  <Link
                    to="/shop"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Best Sellers
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-white mb-2">Support</h4>
                  <Link
                    to="/contact"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    to="/faq"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/shipping"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Shipping
                  </Link>
                  <Link
                    to="/reviews"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Reviews
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-white mb-2">Company</h4>
                  <Link
                    to="/about"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    to="/privacy"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Terms
                  </Link>
                  <Link
                    to="/"
                    className="text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Icons Column */}
            <div className="col-span-3 flex justify-end gap-4">
              <button className="w-10 h-10 bg-[#374151] hover:bg-[#E91E8C] rounded-full flex items-center justify-center transition-colors">
                <Facebook size={20} className="text-white" />
              </button>
              <button className="w-10 h-10 bg-[#374151] hover:bg-[#E91E8C] rounded-full flex items-center justify-center transition-colors">
                <Instagram size={20} className="text-white" />
              </button>
              <button className="w-10 h-10 bg-[#374151] hover:bg-[#E91E8C] rounded-full flex items-center justify-center transition-colors">
                <Twitter size={20} className="text-white" />
              </button>
              <button className="w-10 h-10 bg-[#374151] hover:bg-[#E91E8C] rounded-full flex items-center justify-center transition-colors">
                <Mail size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#374151] text-center">
            <p className="text-[#9CA3AF] text-sm">
              © 2024 Bloom & Bliss. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
