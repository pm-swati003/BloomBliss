import { Search } from "lucide-react";

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  setPage,
  categories,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setPage(1);
        }}
        className="px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={String(cat.id)}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        className="px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
    </div>
  );
}
