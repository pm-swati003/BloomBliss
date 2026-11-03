import { useState } from "react";
import { Link } from "react-router-dom";
import { sendOtp } from "@/lib/api/client";
import { toast } from "sonner";
import { AuthLayout } from "./shared/components/AuthLayout";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email, "password_reset");
      setSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="mb-4">
            We sent a 6-digit OTP to <strong>{email}</strong>
          </p>
          <Link
            to={`/verify-otp?email=${encodeURIComponent(email)}&purpose=password_reset`}
            className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            Enter OTP
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-[#E91E8C] mb-2 text-center">
        Forgot Password?
      </h1>
      <p className="text-center text-[#6B7280] mb-6">
        Enter your email to receive a reset OTP
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[#374151] mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-[#E91E8C] hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
