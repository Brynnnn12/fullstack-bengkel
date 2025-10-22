import { useRouteError, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: unknown;
}

export const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  console.error("Route error:", error);

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist.",
        icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
      };
    }

    if (error?.status === 403) {
      return {
        title: "Access Forbidden",
        description: "You don't have permission to access this page.",
        icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
      };
    }

    return {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
    };
  };

  const errorInfo = getErrorMessage();

  const handleRefresh = () => {
    window.location.reload();
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{errorInfo.icon}</div>
          <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
          <CardDescription className="text-base">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>

          {isDevelopment && error && (
            <details className="mt-4 p-3 bg-muted rounded-md">
              <summary className="cursor-pointer font-medium text-sm">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
