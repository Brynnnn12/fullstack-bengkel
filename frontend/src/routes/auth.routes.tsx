import { AuthLayout } from "../pages/_layouts/AuthLayout";
import { LoginPage } from "../pages/auth/LoginPage";

// Auth routes configuration
export const authRoutes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
];
