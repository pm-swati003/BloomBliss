import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartCount } from "@/lib/api/hooks/useCart";
import { useMe } from "@/lib/api/hooks/useAuth";
import { useLogout } from "@/lib/api/hooks/useAuth";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/api/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
export function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const { data: cartCount } = useCartCount();
  const { data: user } = useMe();
  const logout = useLogout();
  const { data: notifData } = useNotifications({ per_page: 10 });
  const { data: unreadData, refetch: refetchUnread } =
    useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const location = useLocation();

  const notifications = notifData?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = (id, orderId) => {
    markRead.mutate(id, { onSuccess: () => refetchUnread() });
    setNotifOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, { onSuccess: () => refetchUnread() });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };
  const getLinkClass = (path) =>
    `text-[#1F2937] hover:text-[#E91E8C] transition-colors ${
      location.pathname === path ? "text-[#E91E8C] font-semibold" : ""
    }`;

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="h-20 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-[#E91E8C] cursor-pointer">Bloom & Bliss</h1>
            </Link>
          </div>

          <nav className="flex items-center gap-12">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/shop" className={getLinkClass("/shop")}>
              Shop
            </Link>
            <Link to="/occasions" className={getLinkClass("/occasions")}>
              Occasions
            </Link>
            <Link to="/about" className={getLinkClass("/about")}>
              About
            </Link>
            <Link to="/contact" className={getLinkClass("/contact")}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-[#E91E8C] hover:text-[#DB1777] transition-colors text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen((o) => !o)}
                    className="text-[#1F2937] hover:text-[#E91E8C] transition-colors relative hover:cursor-pointer"
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E91E8C] text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-[#E5E7EB] flex justify-between items-center">
                        <span className="font-semibold text-[#1F2937]">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-xs text-[#E91E8C] hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-[#E5E7EB]">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-[#6B7280] text-sm">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              to={
                                n.type === "review_thank_you"
                                  ? "/shop"
                                  : n.data?.order_id
                                    ? `/orders/${n.data.order_id}`
                                    : "/profile?tab=orders"
                              }
                              onClick={() =>
                                handleNotifClick(n.id, n.data?.order_id)
                              }
                              className={`block p-3 text-left hover:bg-[#FFF5F7] ${!n.read_at ? "bg-[#FFF5F7]/50" : ""}`}
                            >
                              <p className="font-medium text-[#1F2937] text-sm">
                                {n.title}
                              </p>
                              {n.body && (
                                <p className="text-xs text-[#6B7280] mt-0.5">
                                  {n.body}
                                </p>
                              )}
                              <p className="text-[10px] text-[#9CA3AF] mt-1">
                                {new Date(n.created_at).toLocaleDateString()}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/profile"
                  className="text-[#1F2937] hover:text-[#E91E8C] transition-colors"
                >
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#1F2937] hover:text-[#E91E8C] transition-colors text-sm hover:cursor-pointer"
                >
                  Logout
                </button>
                <Link
                  to="/cart"
                  className="text-[#1F2937] hover:text-[#E91E8C] transition-colors relative"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E91E8C] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {cartCount ?? 0}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#DB1777] transition-colors text-sm font-semibold"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
