export function StaffList({
  staff,
  isLoading,
  isError,
  error,
  refetch,
  currentPage,
  lastPage,
  setPage,
  roleLabel,
  assignableLabels,
  handleRoleChange,
}) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "admin":
        return "bg-pink-100 text-[#E91E8C] border border-pink-200";
      case "shop_keeper":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "delivery":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#E5E7EB] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">
          {error && typeof error === "object" && "response" in error
            ? error.response?.data?.error || `Request failed (${error.response?.status || "network error"}).`
            : "Failed to load staff. You may not have permission, or the server could not be reached."}
        </p>
        <p className="text-[#6B7280] text-sm mb-4">
          Ensure you are logged in as an admin or super admin.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const roleOptions =
    assignableLabels && Object.keys(assignableLabels).length > 0
      ? assignableLabels
      : {
          admin: "Admin",
          shop_keeper: "Shop Keeper",
          delivery: "Delivery Partner",
        };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
        <table className="w-full min-w-[700px] divide-y divide-[#E5E7EB]">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Name</th>
              <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Email</th>
              <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Role</th>
              <th className="text-left py-3.5 px-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider min-w-[160px]">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white text-sm">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-[#FFF5F7] transition-colors">
                <td className="py-4 px-4 text-[#1F2937] font-medium">{member.name}</td>
                <td className="py-4 px-4 text-[#6B7280]">{member.email}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(
                      member.role
                    )}`}
                  >
                    {roleLabel(member.role)}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {member.role === "super_admin" ? (
                    <span className="text-[#9CA3AF] text-sm italic">Cannot change</span>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border-2 border-[#E5E7EB] hover:border-[#E91E8C] focus:border-[#E91E8C] outline-none text-sm bg-white font-medium text-[#374151] cursor-pointer shadow-xs min-w-[150px]"
                    >
                      {Object.entries(roleOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staff.length === 0 && <p className="text-center text-[#6B7280] py-8">No staff members found</p>}

      {lastPage > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-[#6B7280] text-sm">
            Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-900">{lastPage}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm font-bold shadow-xs">
              {currentPage}
            </span>
            <button
              disabled={currentPage >= lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
