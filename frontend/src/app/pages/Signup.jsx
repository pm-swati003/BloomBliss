import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister, useMe } from "@/lib/api/hooks/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "./shared/components/AuthLayout";

export function Signup() {
  const navigate = useNavigate();
  const register = useRegister();
  const { data: user } = useMe();
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    register.mutate(
      {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      },
      {
        onSuccess: (data) => {
          toast.success(
            "Account created! Please verify your email with the OTP sent.",
          );
          // navigate to OTP verification page with email
          navigate(
            `/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=email_verification`,
          );
        },
        onError: (error) => {
          const errors = error.response?.data?.errors;
          if (errors) {
            Object.values(errors).forEach((arr) => {
              if (Array.isArray(arr)) arr.forEach((msg) => toast.error(msg));
              else toast.error(String(arr));
            });
          } else {
            toast.error(
              error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Registration failed.",
            );
          }
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
        <h2 className="text-[#1F2937] text-2xl mb-2">Create Account</h2>
        <p className="text-[#6B7280]">Sign up to get started</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg"
          />
        </div>
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
              minLength={8}
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
        <div>
          <label htmlFor="password_confirmation">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirmation"
              required
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={register.isPending}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg"
        >
          {register.isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-[#6B7280]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E91E8C] font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
