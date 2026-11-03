import { Plus } from "lucide-react";
import { useAdminProductsLogic } from "./hooks/useAdminProductsLogic";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsGrid } from "./components/ProductsGrid";
import { ProductFormModal } from "./components/ProductFormModal";

export function AdminProducts() {
  const {
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
    isSaving,
  } = useAdminProductsLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-white mb-2 text-3xl font-bold">Product Management</h1>
              <p className="text-white/90">Manage your flower inventory and products</p>
            </div>
            <button
              onClick={() => setModalOpen("add")}
              className="px-6 py-3 bg-white text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setPage={setPage}
            categories={categories}
          />

          <ProductsGrid
            products={products}
            isLoading={isLoading}
            currentPage={currentPage}
            lastPage={lastPage}
            setPage={setPage}
            openEdit={openEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      {(modalOpen === "add" || (modalOpen === "edit" && editingProduct)) && (
        <ProductFormModal
          categories={categories}
          product={modalOpen === "edit" ? editingProduct : null}
          onClose={closeModal}
          onSave={handleSaveProduct}
          isSaving={isSaving}
          createCategory={createCategory}
          refetchCategories={refetchCategories}
        />
      )}
    </div>
  );
}
