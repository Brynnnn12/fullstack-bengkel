import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { reportsApi } from "@/api/reportsApi";
import { StatsCard } from "@/components/features/dashboard/StatsCard";
import { DollarSign, Wrench, Users, CheckCircle, Loader2 } from "lucide-react";

export const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => reportsApi.getDashboardStats(),
    enabled: isAuthenticated,
  });

  // Check if user has MANAGER role
  const isManager = user?.role === "MANAGER";

  // Format currency to Indonesian Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Show welcome message if not MANAGER
  if (!isManager) {
    return (
      <div className="px-4 md:px-8 py-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {isAuthenticated && user ? (
            <p className="text-gray-600 text-lg">
              Selamat datang, {user.name}!
            </p>
          ) : (
            <p className="text-gray-600 text-lg">
              Selamat datang di Sistem Bengkel!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 space-y-8 min-h-full">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        {isAuthenticated && user && (
          <p className="text-gray-600">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-gray-900">{user.name}</span>!
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600 font-medium">
            Memuat data dashboard...
          </span>
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Total Service Orders */}
            <StatsCard
              title="Total Service Orders"
              value={stats.totalServiceOrders.toString()}
              icon={<Wrench className="h-8 w-8" />}
            />

            {/* Total Revenue */}
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={<DollarSign className="h-8 w-8" />}
            />

            {/* Total Customers */}
            <StatsCard
              title="Total Customers"
              value={stats.totalCustomers.toString()}
              icon={<Users className="h-8 w-8" />}
            />

            {/* Completed Jobs */}
            <StatsCard
              title="Completed Jobs"
              value={stats.completedJobs.toString()}
              icon={<CheckCircle className="h-8 w-8" />}
            />
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Aktivitas Terbaru
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 md:pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Service Order #{1000 + i} Selesai
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mobil Toyota Avanza - Servis Rutin
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        2 jam yang lalu
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 md:space-y-4">
              {/* Performance */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-5 md:p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Performa Hari Ini
                </h3>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-xs text-blue-700 mt-1">
                  Service Orders Selesai
                </p>
              </div>

              {/* Pending */}
              <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 shadow-sm p-5 md:p-6">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  Menunggu Proses
                </h3>
                <p className="text-2xl font-bold text-amber-600">3</p>
                <p className="text-xs text-amber-700 mt-1">Service Orders</p>
              </div>

              {/* Revenue Today */}
              <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm p-5 md:p-6">
                <h3 className="text-sm font-semibold text-green-900 mb-2">
                  Revenue Hari Ini
                </h3>
                <p className="text-2xl font-bold text-green-600">Rp 2.5M</p>
                <p className="text-xs text-green-700 mt-1">Total Pendapatan</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
