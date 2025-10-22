import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/useSidebarHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { isCollapsed } = useSidebar();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-30 transition-all duration-300 ${
        isCollapsed ? "md:left-20" : "md:left-64"
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition">
                {/* Avatar */}
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role || "Manager"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Profile Info */}
              <div className="px-4 py-2 text-sm border-b border-gray-200">
                <p className="font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Manager"}
                </p>
              </div>

              {/* Menu Items */}
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 w-4 h-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
