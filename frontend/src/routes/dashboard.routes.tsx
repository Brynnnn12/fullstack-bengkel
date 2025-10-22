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
      // Additional protected routes can be added here
    ],
  },
];
