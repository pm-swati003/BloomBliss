import { Mail, Phone, MapPin, Eye, Ban } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

export function CustomerList({ customers, isLoading, currentPage, lastPage, setPage }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-[#E5E7EB] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {customers.map((customer) => {
          const status = customer.status || "Active";
          const isActive = status === "Active";
          const customerName = customer.name || (customer.email ? customer.email.split("@")[0] : "Customer");
          const initial = customerName.charAt(0).toUpperCase() || "C";
          const location = customer.location || "India";
          const phone = customer.phone && customer.phone !== "—" ? customer.phone : "Not provided";
          const joinDate =
            customer.join_date ||
            (customer.created_at
              ? new Date(customer.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Member");

          return (
            <div
              key={customer.id}
              className="border-2 border-[#E5E7EB] rounded-lg p-5 sm:p-6 hover:border-[#E91E8C] transition-all duration-300 hover:shadow-md bg-white"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E91E8C] to-[#9333EA] flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm">
                      {initial}
                    </div>
                    <div>
                      <h3 className="text-[#1F2937] font-bold text-base mb-1">{customerName}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-center text-[#6B7280] text-sm">
                      <Mail className="w-4 h-4 mr-2 text-[#E91E8C] flex-shrink-0" />
                      <span className="truncate" title={customer.email}>{customer.email || "No email"}</span>
                    </div>
                    <div className="flex items-center text-[#6B7280] text-sm">
                      <Phone className="w-4 h-4 mr-2 text-[#E91E8C] flex-shrink-0" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center text-[#6B7280] text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-[#E91E8C] flex-shrink-0" />
                      <span className="truncate" title={location}>{location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <div className="text-center min-w-[60px]">
                    <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-1">Orders</p>
                    <p className="text-[#1F2937] font-bold text-lg">{customer.orders ?? 0}</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-1">Total Spent</p>
                    <p className="text-[#E91E8C] font-bold text-lg">
                      {formatINR(customer.total_spent ?? 0)}
                    </p>
                  </div>
                  <div className="text-center min-w-[90px]">
                    <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-[#374151] font-medium text-sm whitespace-nowrap">{joinDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2.5 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-all duration-300 shadow-xs"
                      title="View customer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2.5 border-2 border-[#E5E7EB] text-[#6B7280] rounded-lg hover:border-[#EF4444] hover:text-[#EF4444] transition-all duration-300"
                      title="Block / restrict customer"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {customers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-[#6B7280]">No customers found</p>
          </div>
        )}
      </div>

      {lastPage > 1 && (
        <div className="flex justify-between items-center mt-8">
          <p className="text-[#6B7280] text-sm">
            Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-900">{lastPage}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm font-bold shadow-xs">
              {currentPage}
            </span>
            <button
              disabled={currentPage >= lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border-2 border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
