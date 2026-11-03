import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAllReviews } from "@/lib/api/hooks/useReviews";
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewCardSkeleton } from "@/app/components/ReviewCardSkeleton";

export function AllReviews() {
  const { data: reviews = [], isLoading } = useAllReviews();

  const displayReviews = reviews
    .filter((r) => r.rating >= 1 && (r.comment?.trim() || r.rating))
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.comment?.trim() || "Great experience!",
      customer: r.user?.name || "Customer",
    }));

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (displayReviews.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C] mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-[#6B7280] mb-4">No reviews yet.</p>
            <p className="text-[#374151] text-sm">
              Be the first to share your experience after your order!
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-[#FFF5F7] py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2 text-center">
          What Our Customers Say
        </h1>
        <p className="text-[#6B7280] text-center mb-12">
          All reviews from our valued customers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
