export interface DashboardStats {
  totalServiceOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  completedJobs: number;
}

// Mock function untuk dashboard statistics
export const reportsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Simulate API call dengan delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data untuk 4 statistik
    return {
      totalServiceOrders: 48,
      totalRevenue: 15750000, // Rp 15,750,000
      totalCustomers: 32,
      completedJobs: 42,
    };
  },

  // Real API call (untuk nanti jika ada real endpoint)
  // getDashboardStats: async (): Promise<DashboardStats> => {
  //   const { data } = await apiClient.get<DashboardStats>('/reports/dashboard-stats');
  //   return data;
  // },
};
