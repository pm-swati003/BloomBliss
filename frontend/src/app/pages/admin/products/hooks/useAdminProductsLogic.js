import { useState } from "react";
import {
  useAdminProducts,
  useAdminProductCreate,
  useAdminProductUpdate,
  useAdminProductDelete,
  useAdminCategories,
  useAdminCategoryCreate,
} from "@/lib/api/hooks/useAdmin";
import { toast } from "sonner";

export function getStatusLabel(p) {
  if (!p.is_active) return "Inactive";
  if (p.stock <= 0) return "Out of Stock";
  return "Active";
}

export function getStatusColor(label) {
  if (label === "Active") return "bg-[#10B981] text-white";
  if (label === "Inactive") return "bg-[#6B7280] text-white";
  return "bg-[#EF4444] text-white";
}

export function useAdminProductsLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: categories = [], refetch: refetchCategories } = useAdminCategories();
  const createCategory = useAdminCategoryCreate();

  const { data: productsData, isLoading } = useAdminProducts({
    search: searchTerm || undefined,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    per_page: 12,
  });

  const createProduct = useAdminProductCreate();
  const updateProduct = useAdminProductUpdate();
  const deleteProduct = useAdminProductDelete();

  const products = productsData?.data ?? [];
  const currentPage = productsData?.current_page ?? 1;
  const lastPage = productsData?.last_page ?? 1;

  const openEdit = (p) => {
    setEditingProduct(p);
    setModalOpen("edit");
  };

  const closeModal = () => {
    setModalOpen(null);
    setEditingProduct(null);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  const handleSaveProduct = async (values) => {
    if (modalOpen === "add") {
      createProduct.mutate(values, {
        onSuccess: () => {
          toast.success("Product created");
          closeModal();
        },
        onError: () => toast.error("Failed to create product"),
      });
    } else if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, ...values },
        {
          onSuccess: () => {
            toast.success("Product updated");
            closeModal();
          },
          onError: () => toast.error("Failed to update product"),
        }
      );
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingProduct,
    categories,
    refetchCategories,
    createCategory,
    products,
    isLoading,
    currentPage,
    lastPage,
    openEdit,
    closeModal,
    handleDelete,
    handleSaveProduct,
    isSaving: createProduct.isPending || updateProduct.isPending,
  };
}
