import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  UserCog,
  Mail,
  LogOut,
} from "lucide-react";
import { useMe } from "@/lib/api/hooks/useAuth";
import { useLogout } from "@/lib/api/hooks/useAuth";
import { useAdminConfig } from "@/lib/api/hooks/useAdmin";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  {
    to: "/admin/orders",
    icon: ShoppingBag,
    label: "Orders",
    permission: "manage_orders",
  },
  {
    to: "/admin/products",
    icon: Package,
    label: "Products",
    permission: "manage_products",
  },
  {
    to: "/admin/customers",
    icon: Users,
    label: "Customers",
    permission: "view_customers",
  },
  {
    to: "/admin/subscribers",
    icon: Mail,
    label: "Newsletter & Promos",
    permission: "manage_subscribers",
  },
  {
    to: "/admin/settings",
    icon: Settings,
    label: "Settings",
    permission: "manage_settings",
  },
  {
    to: "/admin/staff",
    icon: UserCog,
    label: "Staff access",
    permission: "manage_staff",
  },
];

export function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useMe();
  const { data: config } = useAdminConfig();
  const logout = useLogout();

  const role = user?.role ?? "customer";
  const isSuperAdmin = role === "super_admin";
  const rolePerms = config?.role_permissions?.[role] ?? [];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    return rolePerms.includes(item.permission);
  });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex w-full overflow-x-hidden">
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col fixed h-full z-30">
        <div className="p-4 border-b border-[#E5E7EB]">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#E91E8C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {visibleNavItems.map(({ to, icon: Icon, label }) => {
            const isActive =
              location.pathname === to ||
              (to !== "/admin" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  isActive
                    ? "bg-[#E91E8C] text-white"
                    : "text-[#374151] hover:bg-[#FFF5F7] hover:text-[#E91E8C]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        {/* Logout button at the bottom */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#374151] hover:bg-[#FFF5F7] hover:text-[#E91E8C] transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-w-0 w-[calc(100vw-16rem)] max-w-[calc(100vw-16rem)] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
