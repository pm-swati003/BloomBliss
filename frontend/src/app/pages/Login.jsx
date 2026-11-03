import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin, useMe } from "@/lib/api/hooks/useAuth";
import { setDeliveryToken } from "@/lib/api/deliveryClient";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "./shared/components/AuthLayout";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const { data: user } = useMe();
  const from = location.state?.from?.pathname || "/";

  // If user is already logged in (e.g., page reload), redirect appropriately
  useEffect(() => {
    if (user) {
      if (user.role === "delivery") {
        window.location.href = "/delivery/dashboard";
        return;
      }
      // For normal users, check profile completion
      if (user.profile_completed === false) {
        navigate("/complete-profile", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    login.mutate(
      { email: formData.email.trim(), password: formData.password },
      {
        onSuccess: (data) => {
          if (data?.user?.role === "delivery") {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            setDeliveryToken(data.token);
            toast.success("Redirecting to Delivery Portal...");
            window.location.href = "/delivery/dashboard";
            return;
          }
          toast.success("Login successful!");
          // Redirect based on profile completion
          const profileCompleted = data?.user?.profile_completed;
          if (profileCompleted === false) {
            setTimeout(
              () => navigate("/complete-profile", { replace: true }),
              100,
            );
          } else {
            setTimeout(() => navigate(from, { replace: true }), 100);
          }
        },
        onError: (error) => {
          const msg =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Login failed.";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-[#E91E8C] text-3xl font-bold mb-2">
          Bloom & Bliss
        </h1>
        <h2 className="text-[#1F2937] text-2xl mb-2">Welcome Back</h2>
        <p className="text-[#6B7280]">Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border-2 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border-2 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="text-right mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-[#E91E8C] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg"
        >
          {login.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-[#6B7280]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#E91E8C] font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
