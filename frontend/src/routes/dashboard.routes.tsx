import { lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/pages/_layouts/DashboardLayout";

// Lazy load dashboard pages for better performance
const DashboardPage = lazy(() =>
  import("../pages/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
);

const CustomerPage = lazy(() =>
  import("../pages/customers/CustomerPage").then((module) => ({
    default: module.CustomerPage,
  }))
);

const VehiclePage = lazy(() =>
  import("../pages/vehicles/VehiclePage").then((module) => ({
    default: module.VehiclePage,
  }))
);

const ServiceLogPage = lazy(() =>
  import("../pages/serviceLogs/ServiceLogPage").then((module) => ({
    default: module.ServiceLogPage,
  }))
);

const InventoryPage = lazy(() =>
  import("../pages/inventory/InventoryPage").then((module) => ({
    default: module.InventoryPage,
  }))
);

// Dashboard routes configuration
export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute>
            <CustomerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vehicles",
        element: (
          <ProtectedRoute>
            <VehiclePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "service-logs",
        element: (
          <ProtectedRoute>
            <ServiceLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory",
        element: (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      // Additional protected routes can be added here
    ],
  },
];
