import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({
  size = 50,
  color = "#3b82f6",
  className = "",
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ClipLoader size={size} color={color} />
    </div>
  );
};
