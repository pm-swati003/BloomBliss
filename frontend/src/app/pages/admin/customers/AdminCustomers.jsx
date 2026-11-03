import { useAdminCustomersLogic } from "./hooks/useAdminCustomersLogic";
import { CustomerStats } from "./components/CustomerStats";
import { CustomerFilters } from "./components/CustomerFilters";
import { CustomerList } from "./components/CustomerList";

export function AdminCustomers() {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    page,
    setPage,
    customers,
    isLoading,
    currentPage,
    lastPage,
    totalCustomers,
    totalOrders,
    totalRevenue,
    activeCount,
  } = useAdminCustomersLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7] w-full max-w-full overflow-hidden">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-2 text-2xl lg:text-3xl font-bold">Customer Management</h1>
          <p className="text-white/90 text-sm lg:text-base">View and manage all your customers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <CustomerStats
          totalCustomers={totalCustomers}
          activeCount={activeCount}
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
        />

        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          <CustomerFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setPage={setPage}
          />

          <CustomerList
            customers={customers}
            isLoading={isLoading}
            currentPage={currentPage}
            lastPage={lastPage}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
