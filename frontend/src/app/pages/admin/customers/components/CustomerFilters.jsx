import { Search } from "lucide-react";

export function CustomerFilters({ searchTerm, setSearchTerm, sortBy, setSortBy, setPage }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setPage(1);
        }}
        className="px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none transition-colors duration-300"
      >
        <option value="name">Sort by Name</option>
        <option value="orders">Sort by Orders</option>
        <option value="spent">Sort by Amount Spent</option>
        <option value="date">Sort by Join Date</option>
      </select>
    </div>
  );
}
