import { useState, useEffect } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner size={60} />;
  }

  return <LoginForm />;
};
