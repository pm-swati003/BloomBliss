import { Plus } from "lucide-react";
import { useAdminStaffLogic } from "./hooks/useAdminStaffLogic";
import { StaffFilters } from "./components/StaffFilters";
import { StaffList } from "./components/StaffList";
import { RolePermissions } from "./components/RolePermissions";
import { AddStaffModal } from "./components/AddStaffModal";

export function AdminStaff() {
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    addModalOpen,
    setAddModalOpen,
    staff,
    currentPage,
    lastPage,
    isLoading,
    isError,
    error,
    refetch,
    assignableLabels,
    handleRoleChange,
    roleLabel,
    handleCreateStaff,
    isSaving,
    config,
  } = useAdminStaffLogic();

  return (
    <div className="min-h-screen bg-[#FFF5F7] w-full max-w-full overflow-hidden">
      <div className="bg-gradient-to-r from-[#E91E8C] to-[#9333EA] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-white mb-2 text-2xl lg:text-3xl font-bold font-sans">Staff Access</h1>
            <p className="text-white/90 text-sm lg:text-base">
              Add staff or change roles. Only you (super admin) can do this.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 bg-white text-[#E91E8C] rounded-lg hover:bg-[#FFF5F7] transition-all font-semibold flex items-center gap-2 shrink-0 shadow-sm text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Staff
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          <StaffFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setPage={setPage}
          />

          <StaffList
            staff={staff}
            isLoading={isLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            currentPage={currentPage}
            lastPage={lastPage}
            setPage={setPage}
            roleLabel={roleLabel}
            assignableLabels={assignableLabels}
            handleRoleChange={handleRoleChange}
          />
        </div>

        <RolePermissions config={config} roleLabel={roleLabel} />
      </div>

      {addModalOpen && (
        <AddStaffModal
          assignableLabels={assignableLabels}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleCreateStaff}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
