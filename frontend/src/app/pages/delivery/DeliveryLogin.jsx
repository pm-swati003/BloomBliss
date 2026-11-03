import { useState } from "react";
import { Package, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deliveryLogin } from "@/lib/api/hooks/useDelivery";
import { toast } from "sonner";
import { AuthLayout } from "../shared/components/AuthLayout";

export function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await deliveryLogin(email, password);
      toast.success("Welcome back!");
      if (!user.profile_completed) {
        navigate("/delivery/profile");
      } else {
        navigate("/delivery/dashboard");
      }
    } catch (err) {
      toast.error(
        err?.message || "Invalid credentials or not a delivery account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-[#1F2937] mb-2">Bloom & Bliss</h1>
        <h2 className="text-[#6B7280]">Delivery Partner Portal</h2>
      </div>

      <h2 className="text-[#1F2937] mb-6 text-center">Welcome Back!</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-[#374151] mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
          </div>
        </div>
        <div>
          <label className="block text-[#374151] mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pl-12 pr-12 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E91E8C] transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#E91E8C] to-[#9333EA] text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
        <p className="text-[#6B7280] text-sm">
          Need help?{" "}
          <a
            href="mailto:support@bloomandbliss.com"
            className="text-[#E91E8C] hover:text-[#DB1777]"
          >
            Contact Support
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
