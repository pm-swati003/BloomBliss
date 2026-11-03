import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/lib/api/hooks/useCart";
import { useState } from "react";
import { Link } from "react-router-dom";

export function ProductRenderer({ product, showDiscount = true }) {
  const addToCart = useAddToCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({
      product_id: product.id,
      quantity: 1,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine discount existence
  const hasDiscount = product.discount_percentage > 0;

  // Compute final price: use discounted_price if available, otherwise calculate from percentage
  let finalPrice = product.discounted_price;
  if (!finalPrice && hasDiscount) {
    finalPrice = product.price * (1 - product.discount_percentage / 100);
  }
  if (!finalPrice) {
    finalPrice = product.price;
  }
  // Round to two decimals
  finalPrice = Math.round(finalPrice * 100) / 100;

  const originalPrice = product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative border border-[#E5E7EB]">
      {showDiscount && hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-[#9333EA] text-white px-3 py-1 rounded-md text-sm font-medium">
          {product.discount_percentage}% off
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block">
        <div className="w-full aspect-square bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] flex items-center justify-center">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl mb-2">🌸</span>
              <span className="text-[#E91E8C] text-sm font-medium">
                {product.category?.name || "Product"}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <p className="text-[#6B7280] text-sm mb-1">
            {product.category?.name}
          </p>
          <h3 className="text-[#1F2937] mb-2 hover:text-[#E91E8C] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[#E91E8C] font-bold">
            ₹
            {finalPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          {hasDiscount && (
            <p className="text-[#6B7280] text-sm line-through">
              ₹
              {originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          className="w-full py-2.5 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <ShoppingCart size={18} />
          <span>{addToCart.isPending ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
