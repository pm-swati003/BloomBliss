import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminStaff,
  useAdminStaffUpdateRole,
  useAdminStaffCreate,
  useAdminConfig,
} from "@/lib/api/hooks/useAdmin";

const DEFAULT_ROLES = {
  super_admin: "Super Admin",
  admin: "Admin",
  shop_keeper: "Shop Keeper",
  delivery: "Delivery Partner",
  customer: "Customer",
};

const DEFAULT_ASSIGNABLE_ROLES = {
  admin: "Admin",
  shop_keeper: "Shop Keeper",
  delivery: "Delivery Partner",
};

export function useAdminStaffLogic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: config } = useAdminConfig();
  const createStaff = useAdminStaffCreate();
  const updateRole = useAdminStaffUpdateRole();

  const {
    data: staffData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminStaff({
    search: searchTerm || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    page,
    per_page: 15,
  });

  const staff = staffData?.data ?? [];
  const currentPage = staffData?.current_page ?? 1;
  const lastPage = staffData?.last_page ?? 1;

  const assignableLabels =
    config?.assignable_roles && Object.keys(config.assignable_roles).length > 0
      ? config.assignable_roles
      : DEFAULT_ASSIGNABLE_ROLES;

  const handleRoleChange = (userId, newRole) => {
    updateRole.mutate(
      { id: userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("Role updated successfully");
          refetch();
        },
        onError: (e) => toast.error(e?.response?.data?.error ?? "Failed to update role"),
      }
    );
  };

  const roleLabel = (role) => {
    if (!role) return "Staff";
    const map = {
      ...DEFAULT_ROLES,
      ...(config?.roles || {}),
    };
    return map[role] || role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleCreateStaff = (data) => {
    createStaff.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: (_, variables) => {
          if (variables.role === "delivery") {
            toast.success(
              "Delivery partner added. They must log in at /delivery/login with this email and password."
            );
          } else {
            toast.success(
              "Staff added. They can log in with this email and password."
            );
          }
          setAddModalOpen(false);
          refetch();
        },
        onError: (e) => {
          const msg =
            e?.response?.data?.errors?.email?.[0] ||
            e?.response?.data?.message ||
            "Failed to add staff";
          toast.error(msg);
        },
      }
    );
  };

  return {
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
    isSaving: createStaff.isPending,
    config,
  };
}
