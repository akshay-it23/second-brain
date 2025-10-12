import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

const variantClasses = {
  primary: "bg-purple-900 text-white hover:bg-purple-800",
  secondary: "bg-purple-100 text-purple-600 hover:bg-purple-200",
};

const baseStyles =
  "px-4 py-2 rounded-md font-medium flex items-center justify-center transition-all duration-200";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth = false,
  loading = false,
  className = "",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={!loading && !disabled ? onClick : undefined}
      className={`
        ${variantClasses[variant]} 
        ${baseStyles} 
        ${fullWidth ? "w-full" : ""} 
        ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""} 
        ${className}
      `}
      disabled={loading || disabled}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {loading ? "Loading..." : text}
    </button>
  );
}
