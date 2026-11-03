import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLatestReviews } from "@/lib/api/hooks/useReviews";

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.trim()[0] || "?").toUpperCase();
}

export function Reviews() {
  const { data: reviews = [], isLoading } = useLatestReviews(3);

  const displayReviews = reviews
    .filter((r) => r.rating >= 1 && (r.comment?.trim() || r.rating))
    .slice(0, 3)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.comment?.trim() || "Great experience!",
      customer: r.user?.name || "Customer",
    }));

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-20">
        <h2 className="text-[#1F2937] mb-12 text-center">
          What Our Customers Say
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#F9FAFB] rounded-lg shadow-md p-6 border border-[#E5E7EB] animate-pulse"
              >
                <div className="h-5 w-32 bg-[#E5E7EB] rounded mb-4" />
                <div className="h-4 bg-[#E5E7EB] rounded mb-2" />
                <div className="h-4 bg-[#E5E7EB] rounded mb-2" />
                <div className="h-4 bg-[#E5E7EB] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#E5E7EB] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : displayReviews.length === 0 ? (
          <p className="text-center text-[#6B7280] py-8">
            No reviews yet. Be the first to share your experience after your
            order!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#F9FAFB] rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-[#E5E7EB]"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < review.rating
                            ? "fill-[#E91E8C] text-[#E91E8C]"
                            : "text-[#E5E7EB]"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[#6B7280] mb-4 italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-full bg-[#E91E8C] text-white flex items-center justify-center text-sm font-semibold shrink-0"
                      aria-hidden
                    >
                      {getInitials(review.customer)}
                    </span>
                    <p className="text-[#1F2937] font-medium">
                      {review.customer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/reviews"
                className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors font-medium"
              >
                View more
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
