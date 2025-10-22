import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/contexts/useSidebarHook";
import {
  LayoutDashboard,
  Wrench,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    id: "service",
    label: "Service Orders",
    icon: <Wrench className="w-5 h-5" />,
    href: "/dashboard/service-orders",
    badge: 3,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/dashboard/inventory",
  },
  {
    id: "customers",
    label: "Customers",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/customers",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle - Fixed at top left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - Desktop fixed, Mobile overlay */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        } ${!isOpen && "hidden md:flex"}`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center justify-between p-4 border-b border-slate-700 ${
            isCollapsed ? "flex-col gap-2" : ""
          }`}
        >
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              BT
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-lg truncate">BengkelTracker</h1>
                <p className="text-xs text-slate-400">Sistem Bengkel</p>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-slate-400 hover:text-white transition"
              title="Collapse sidebar"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-slate-400 hover:text-white transition"
              title="Expand sidebar"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm font-medium truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
            <p>© 2025 BengkelTracker</p>
            <p>All rights reserved</p>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
