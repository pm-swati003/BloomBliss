import { useState } from "react";
import { useAdminCustomers, useAdminStats } from "@/lib/api/hooks/useAdmin";

export function useAdminCustomersLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  const { data: stats } = useAdminStats();
  const { data: customersData, isLoading } = useAdminCustomers({
    search: searchTerm || undefined,
    sort_by: sortBy,
    page,
    per_page: 15,
  });

  const customers = customersData?.data ?? [];
  const currentPage = customersData?.current_page ?? 1;
  const lastPage = customersData?.last_page ?? 1;
  
  const totalCustomers = stats?.customers_count ?? 0;
  const totalOrders = stats?.orders_count ?? 0;
  const totalRevenue = stats?.total_revenue ?? 0;
  const activeCount = totalCustomers;

  return {
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
  };
}
