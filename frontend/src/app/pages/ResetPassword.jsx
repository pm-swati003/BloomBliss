import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "@/lib/api/client";
import { toast } from "sonner";
import { AuthLayout } from "./shared/components/AuthLayout";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      toast.error("Invalid reset link");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetToken, password, passwordConfirmation);
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Reset failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout>
        <p className="mb-4">Invalid reset link. Please request a new OTP.</p>
        <Link
          to="/forgot-password"
          className="text-[#E91E8C] hover:underline"
        >
          Go to Forgot Password
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-4">
        Set New Password
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[#374151] mb-2">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            placeholder="Minimum 8 characters"
          />
        </div>
        <div className="mb-6">
          <label className="block text-[#374151] mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
