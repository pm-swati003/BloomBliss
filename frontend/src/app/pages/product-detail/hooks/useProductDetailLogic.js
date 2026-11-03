import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProduct, useBestSellingProducts } from "@/lib/api/hooks/useProducts";
import { useAddToCart } from "@/lib/api/hooks/useCart";
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/lib/api/hooks/useReviews";
import { useMe } from "@/lib/api/hooks/useAuth";
import { toast } from "sonner";

export function useProductDetailLogic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = id ? parseInt(id) : 0;

  // API Hooks
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: reviews = [] } = useReviews(productId);
  const { data: relatedProducts = [] } = useBestSellingProducts();
  const { data: user } = useMe();
  const addToCart = useAddToCart();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  // Local State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showThankYouPromo, setShowThankYouPromo] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Effects
  useEffect(() => {
    if (searchParams.get("review") === "1") setShowReviewForm(true);
  }, [searchParams]);

  // Derived State
  const averageRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const hasDiscount = product?.discount_percentage > 0;
  let finalPrice = product?.discounted_price;
  if (!finalPrice && hasDiscount) {
    finalPrice = product.price * (1 - product.discount_percentage / 100);
  }
  if (!finalPrice) {
    finalPrice = product?.price || 0;
  }
  finalPrice = Math.round(finalPrice * 100) / 100;
  const originalPrice = product?.price || 0;

  const productImages = product?.image ? [product.image, ...(product.images || [])] : [];

  // Handlers
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    addToCart.mutate(
      { product_id: productId, quantity },
      {
        onSuccess: () => toast.success(`${product?.name} added to cart!`),
        onError: (err) => toast.error(err.response?.data?.message || "Failed"),
      }
    );
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    if (!reviewForm.rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error("Please enter a review");
      return;
    }
    if (editingReviewId) {
      updateReview.mutate(
        {
          id: editingReviewId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
        {
          onSuccess: () => {
            toast.success("Review updated");
            setReviewForm({ rating: 0, comment: "" });
            setShowReviewForm(false);
            setEditingReviewId(null);
          },
          onError: (err) => toast.error(err.response?.data?.message || "Failed"),
        }
      );
      return;
    }
    createReview.mutate(
      {
        product_id: productId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      },
      {
        onSuccess: () => {
          toast.success("Thank you for your review!");
          setReviewForm({ rating: 0, comment: "" });
          setShowReviewForm(false);
          setShowThankYouPromo(true);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed"),
      }
    );
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({ rating: review.rating, comment: review.comment || "" });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    deleteReview.mutate(
      { id: reviewId, productId },
      {
        onSuccess: () => toast.success("Review deleted"),
        onError: () => toast.error("Failed"),
      }
    );
  };

  return {
    navigate,
    productId,
    product,
    productLoading,
    productImages,
    reviews,
    relatedProducts,
    user,
    quantity,
    setQuantity,
    selectedImage,
    setSelectedImage,
    reviewForm,
    setReviewForm,
    showReviewForm,
    setShowReviewForm,
    showThankYouPromo,
    setShowThankYouPromo,
    editingReviewId,
    setEditingReviewId,
    averageRating,
    finalPrice,
    originalPrice,
    hasDiscount,
    handleAddToCart,
    handleSubmitReview,
    handleEditReview,
    handleDeleteReview,
    isAddingToCart: addToCart.isPending,
    isSubmittingReview: createReview.isPending || updateReview.isPending,
  };
}
