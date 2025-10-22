import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { dashboardRoutes } from "./dashboard.routes";
import { authRoutes } from "./auth.routes";
import { errorRoutes } from "./error.routes";

// Combine all route configurations
const router = createBrowserRouter([
  ...dashboardRoutes,
  ...authRoutes,
  ...errorRoutes,
]);

export const AppRouter = () => {
  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
        <RouterProvider router={router} />
      </Suspense>
    </SidebarProvider>
  );
};
