import { useProductDetailLogic } from "./hooks/useProductDetailLogic";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { ProductReviews } from "./components/ProductReviews";
import { RelatedProducts } from "./components/RelatedProducts";
import { ProductDetailShimmer } from "@/app/components/effects/Shimmer";
import { ArrowLeft } from "lucide-react";

export function ProductDetail() {
  const {
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
    isAddingToCart,
    isSubmittingReview,
  } = useProductDetailLogic();

  if (productLoading) {
    return <ProductDetailShimmer />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div>
          <h2>Product not found</h2>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C] mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <ProductGallery
              product={product}
              productImages={productImages}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            <ProductInfo
              product={product}
              averageRating={averageRating}
              reviewsCount={reviews.length}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              hasDiscount={hasDiscount}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>

        <ProductReviews
          user={user}
          reviews={reviews}
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          showThankYouPromo={showThankYouPromo}
          setShowThankYouPromo={setShowThankYouPromo}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          handleSubmitReview={handleSubmitReview}
          handleEditReview={handleEditReview}
          handleDeleteReview={handleDeleteReview}
          editingReviewId={editingReviewId}
          setEditingReviewId={setEditingReviewId}
          isSubmittingReview={isSubmittingReview}
        />

        <RelatedProducts
          relatedProducts={relatedProducts}
          productId={productId}
        />
      </div>
    </div>
  );
}
