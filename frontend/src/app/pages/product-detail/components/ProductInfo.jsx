import { Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";

export function ProductInfo({
  product,
  averageRating,
  reviewsCount,
  finalPrice,
  originalPrice,
  hasDiscount,
  quantity,
  setQuantity,
  handleAddToCart,
  isAddingToCart,
}) {
  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/shop?category=${product.category?.slug}`}
          className="text-[#E91E8C] text-sm"
        >
          {product.category?.name}
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < averageRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm">
          ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
        </span>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-[#E91E8C]">
            ₹
            {finalPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {hasDiscount && (
            <span className="text-xl line-through text-[#6B7280]">
              ₹
              {originalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>
        {hasDiscount && (
          <span className="inline-block bg-[#9333EA] text-white px-3 py-1 rounded-md text-sm">
            {product.discount_percentage}% OFF
          </span>
        )}
      </div>
      {product.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-[#6B7280]">{product.description}</p>
        </div>
      )}
      <div className="mb-6">
        <p
          className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `In Stock (${product.stock} available)`
            : "Out of Stock"}
        </p>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <label>Quantity:</label>
        <div className="flex items-center border-2 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-2 hover:bg-[#FFF5F7]"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock || 10, quantity + 1))
            }
            disabled={quantity >= (product.stock || 10)}
            className="p-2 hover:bg-[#FFF5F7]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || product.stock === 0}
        className="w-full py-4 bg-[#E91E8C] text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <ShoppingCart size={20} />
        <span>
          {isAddingToCart
            ? "Adding..."
            : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </span>
      </button>
    </div>
  );
}
