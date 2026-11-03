import { UserCog } from "lucide-react";

const DEFAULT_ROLE_PERMISSIONS = {
  super_admin: ["manage_staff", "manage_products", "manage_orders", "view_customers", "manage_settings", "manage_subscribers"],
  admin: ["manage_products", "manage_orders", "view_customers", "manage_settings"],
  shop_keeper: ["manage_orders", "view_customers"],
  delivery: [],
};

export function RolePermissions({ config, roleLabel }) {
  const rolePerms = config?.role_permissions || DEFAULT_ROLE_PERMISSIONS;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-[#1F2937] mb-2 flex items-center gap-2 text-xl font-bold font-sans">
        <UserCog className="w-5 h-5 text-[#E91E8C]" />
        Role Permissions
      </h2>
      <p className="text-[#6B7280] text-sm mb-4">
        Super Admin: full access. Admin: products, orders, customers, settings. Shop Keeper: orders and customers.
        Delivery: delivery partner portal only (no admin access).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {Object.entries(rolePerms).map(([roleName, perms]) => (
          <div key={roleName} className="border border-[#E5E7EB] rounded-lg p-3.5 bg-[#F9FAFB]">
            <p className="font-bold text-[#1F2937] mb-1">{roleLabel(roleName)}</p>
            <p className="text-[#6B7280] text-xs">
              {roleName === "super_admin"
                ? "All permissions (Full Access)"
                : perms && perms.length
                ? perms.map((p) => p.replace(/_/g, " ")).join(", ")
                : "No admin access (Delivery Portal Only)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
