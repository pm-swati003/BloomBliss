import { Link } from "react-router-dom";
import { Star, Pencil, Trash2 } from "lucide-react";

export function ProductReviews({
  user,
  reviews,
  showReviewForm,
  setShowReviewForm,
  showThankYouPromo,
  setShowThankYouPromo,
  reviewForm,
  setReviewForm,
  handleSubmitReview,
  handleEditReview,
  handleDeleteReview,
  editingReviewId,
  setEditingReviewId,
  isSubmittingReview,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg"
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        )}
      </div>
      {showThankYouPromo && (
        <div className="mb-8 p-6 bg-gradient-to-r from-[#E91E8C]/10 to-[#9333EA]/10 border-2 border-[#E91E8C]/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">
            Thank you for your review!
          </h3>
          <p className="mb-4">
            Your feedback helps other customers. Loved the blooms? Order more
            and spread the joy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="px-5 py-2.5 bg-[#E91E8C] text-white rounded-lg"
            >
              Shop more
            </Link>
            <button
              onClick={() => setShowThankYouPromo(false)}
              className="px-5 py-2.5 border-2 border-[#E5E7EB] rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {showReviewForm && user && (
        <div className="mb-8 p-6 bg-[#FFF5F7] rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingReviewId ? "Edit your review" : "Your Review"}
          </h3>
          <div className="space-y-4">
            <div>
              <label>Rating</label>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setReviewForm({ ...reviewForm, rating: i + 1 })
                    }
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={
                        i + 1 <= reviewForm.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label>Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                className="w-full px-4 py-3 border-2 rounded-lg"
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>
            <div className="flex gap-2">
              {editingReviewId && (
                <button
                  onClick={() => {
                    setEditingReviewId(null);
                    setReviewForm({ rating: 0, comment: "" });
                    setShowReviewForm(false);
                  }}
                  className="px-4 py-2 border-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="px-6 py-2 bg-[#E91E8C] text-white rounded-lg"
              >
                {isSubmittingReview
                  ? editingReviewId
                    ? "Updating..."
                    : "Submitting..."
                  : editingReviewId
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
      {reviews.length === 0 ? (
        <p className="text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">
                    {review.user?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B7280]">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : ""}
                  </span>
                  {user?.id === review.user_id && (
                    <>
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-1.5 text-[#6B7280] hover:text-[#E91E8C]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1.5 text-[#6B7280] hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-[#6B7280] mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
