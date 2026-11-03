import { useState, useEffect } from "react";
import { toast } from "sonner";

export function ProductFormModal({
  categories,
  product,
  onClose,
  onSave,
  isSaving,
  createCategory,
  refetchCategories,
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(() => {
    const fromProduct = product?.category_id ?? product?.category?.id;
    const fromCategories = categories[0]?.id;
    return fromProduct ?? fromCategories ?? 0;
  });
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [discountPercentage, setDiscountPercentage] = useState(
    product?.discount_percentage?.toString() ?? "0"
  );
  const [image, setImage] = useState(product?.image ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isBestSelling, setIsBestSelling] = useState(product?.is_best_selling ?? false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  useEffect(() => {
    const fromProduct = product?.category_id ?? product?.category?.id;
    if (fromProduct != null) {
      setCategoryId(fromProduct);
      return;
    }
    if (!product && categories.length > 0 && categoryId === 0) {
      setCategoryId(categories[0].id);
    }
  }, [product?.id, product?.category_id, product?.category?.id, product, categories.length]);

  useEffect(() => {
    if (!product && categories.length === 0) setShowNewCategory(true);
  }, [product, categories.length]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }
    createCategory.mutate(
      {
        name: trimmed,
        description: newCategoryDescription.trim() || undefined,
        is_active: true,
      },
      {
        onSuccess: (newCat) => {
          toast.success(`Category "${newCat.name}" created`);
          refetchCategories();
          setCategoryId(newCat.id);
          setShowNewCategory(false);
          setNewCategoryName("");
          setNewCategoryDescription("");
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.errors?.name?.[0] ||
            err?.response?.data?.message ||
            "Failed to create category";
          toast.error(msg);
        },
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validCategoryId =
      categoryId && categories.some((c) => c.id === categoryId)
        ? categoryId
        : categories[0]?.id;
    if (!validCategoryId) {
      toast.error("Please select or create a category");
      return;
    }
    onSave({
      category_id: validCategoryId,
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price) || 0,
      discount_percentage: parseFloat(discountPercentage) || 0,
      image: image.trim() || undefined,
      stock: parseInt(stock, 10) || 0,
      is_active: isActive,
      is_featured: isFeatured,
      is_best_selling: isBestSelling,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center">
          <h2 className="text-[#1F2937] text-xl font-bold">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[#374151] mb-1 font-medium">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#374151] font-medium">Category *</label>
              {!showNewCategory ? (
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-sm text-[#E91E8C] hover:underline"
                >
                  + Create new category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                  }}
                  className="text-sm text-[#6B7280] hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
            {showNewCategory ? (
              <div className="p-3 border-2 border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
                <input
                  type="text"
                  placeholder="Category name *"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={createCategory.isPending || !newCategoryName.trim()}
                  className="w-full px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50 transition-colors"
                >
                  {createCategory.isPending ? "Creating..." : "Create category"}
                </button>
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#374151] mb-1 font-medium">Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[#374151] mb-1 font-medium">Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#374151] mb-1 font-medium">Stock *</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors"
              required
            />
          </div>
          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#E91E8C] rounded focus:ring-[#E91E8C]"
              />
              <span className="text-[#374151]">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#E91E8C] rounded focus:ring-[#E91E8C]"
              />
              <span className="text-[#374151]">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSelling}
                onChange={(e) => setIsBestSelling(e.target.checked)}
                className="w-4 h-4 text-[#E91E8C] rounded focus:ring-[#E91E8C]"
              />
              <span className="text-[#374151]">Best Selling</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-[#E5E7EB] rounded-lg text-[#374151] hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] disabled:opacity-50 transition-colors font-medium"
            >
              {isSaving ? "Saving..." : product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
