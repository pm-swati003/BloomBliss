import { Trash2, Plus, Minus } from "lucide-react";
import { useUpdateCartItem, useRemoveFromCart } from "@/lib/api/hooks/useCart";
import { useState } from "react";

export function CartItemRenderer({ item }) {
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [imageError, setImageError] = useState(false);

  const handleUpdateQuantity = (change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateCart.mutate({ id: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const price = item.product?.discounted_price || item.product?.price || 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[#FCE7F3] to-[#FFF5F7] rounded-lg flex items-center justify-center">
          {item.product?.image && !imageError ? (
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-1">🌸</span>
              <span className="text-[#E91E8C] text-xs">Image</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[#1F2937] mb-1">
                {item.product?.name || "Product"}
              </h3>
              {item.size && <p className="text-[#6B7280]">Size: {item.size}</p>}
              {item.occasion && (
                <p className="text-[#6B7280]">Occasion: {item.occasion}</p>
              )}
            </div>
            <button
              onClick={handleRemove}
              disabled={removeFromCart.isPending}
              className="text-[#6B7280] hover:text-[#E91E8C] transition-colors duration-300 disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center border-2 border-[#E5E7EB] rounded-lg">
              <button
                onClick={() => handleUpdateQuantity(-1)}
                disabled={updateCart.isPending || item.quantity <= 1}
                className="p-2 hover:bg-[#FFF5F7] transition-colors duration-300 disabled:opacity-50"
              >
                <Minus className="w-4 h-4 text-[#374151]" />
              </button>
              <span className="px-4 py-2 text-[#1F2937]">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(1)}
                disabled={updateCart.isPending}
                className="p-2 hover:bg-[#FFF5F7] transition-colors duration-300 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 text-[#374151]" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-[#E91E8C]">
                ₹{(price * item.quantity).toLocaleString("en-IN")}
              </p>
              <p className="text-[#6B7280] text-sm">
                ₹{price.toLocaleString("en-IN")} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
