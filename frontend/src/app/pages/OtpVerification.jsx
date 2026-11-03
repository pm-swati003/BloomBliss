import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyOtp, sendOtp } from "@/lib/api/client";
import { toast } from "sonner";
import { AuthLayout } from "./shared/components/AuthLayout";

export function OtpVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "email_verification";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing");
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || resending || !email) return;
    setResending(true);
    try {
      await sendOtp(email, purpose);
      toast.success("A new OTP has been sent to your email.");
      setResendCooldown(30);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(email, otp, purpose);
      if (purpose === "email_verification") {
        toast.success("Email verified! You can now log in.");
        navigate("/login");
      } else {
        // password_reset: we get a reset_token
        const resetToken = response.data.reset_token;
        navigate(`/reset-password?token=${resetToken}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-4">Verify OTP</h1>
      <p className="text-center text-[#6B7280] mb-6">
        A 6-digit code was sent to <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[#374151] mb-2">6-Digit OTP</label>
          <input
            type="text"
            maxLength={6}
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl tracking-widest font-mono px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
            placeholder="000000"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="text-[#E91E8C] hover:underline text-sm disabled:opacity-50 font-medium"
        >
          {resending
            ? "Sending new OTP..."
            : resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Didn't receive? Resend OTP"}
        </button>
        <div>
          <Link to="/login" className="text-[#6B7280] hover:text-[#1F2937] text-xs">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
