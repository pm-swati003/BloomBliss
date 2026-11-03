import { useState } from "react";
import { toast } from "sonner";
import { useNewsletterSubscribe } from "@/lib/api/hooks/useNewsletter";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const subscribe = useNewsletterSubscribe();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }
    subscribe.mutate(trimmed, {
      onSuccess: (data) => {
        toast.success(data.message);
        setEmail("");
      },
      onError: (err) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Subscription failed. Please try again.";
        toast.error(msg);
      },
    });
  };

  return (
    <section className="w-full bg-[#FFF5F7] py-20">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-[#E91E8C]">Get Floral Updates</h2>
          <p className="text-[#6B7280]">
            Subscribe to receive exclusive offers and flower care tips
          </p>

          <form onSubmit={handleSubmit} className="flex gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribe.isPending}
              className="flex-1 px-4 py-3 border-2 border-[#E5E7EB] rounded-lg bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#E91E8C] focus:outline-none transition-colors disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="px-8 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors whitespace-nowrap shadow-md disabled:opacity-70"
            >
              {subscribe.isPending ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
