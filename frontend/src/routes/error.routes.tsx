import { ErrorPage } from "../pages/error/ErrorPage";

// Error routes configuration
export const errorRoutes = [
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
];
