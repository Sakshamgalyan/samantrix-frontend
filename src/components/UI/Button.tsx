import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "warning"
    | "danger"
    | "info"
    | "outline"
    | "ghost"
    | "link"
    | "menu";
  size?: "xs" | "sm" | "md" | "lg";
  fullwidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
  borderRadius?: string;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullwidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  disabled = false,
  bgColor,
  textColor,
  borderRadius,
  children,
  className = "",
  style,
  ...rest
}) => {
  // Variant styles - Using Forest Color Palette
  const variantClasses: Record<string, string> = {
    primary:
      "bg-forest-800 hover:bg-forest-700 text-forest-50 border-transparent",
    secondary:
      "bg-forest-700 hover:bg-forest-800 text-forest-50 border-transparent",
    tertiary:
      "bg-forest-300 hover:bg-forest-700 text-forest-950 border-transparent",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent",
    danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
    info: "bg-forest-900 hover:bg-forest-950 text-forest-50 border-transparent",
    outline:
      "bg-transparent hover:bg-forest-50 text-forest-800 border-forest-300 border-2",
    ghost:
      "bg-transparent hover:bg-forest-50 text-forest-800 border-transparent",
    link: "bg-transparent hover:underline text-forest-700 border-transparent p-0",
    menu: "bg-transparent hover:bg-forest-50 text-forest-800 border-transparent justify-start",
  };

  // Size styles
  const sizeClasses: Record<string, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-800";

  // Build the final class string
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullwidth ? "w-full" : "",
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    variant !== "link" ? "rounded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Build custom inline styles
  const customStyles: React.CSSProperties = {
    ...style,
    ...(bgColor && { backgroundColor: bgColor }),
    ...(textColor && { color: textColor }),
    ...(borderRadius && { borderRadius }),
  };

  return (
    <button
      className={buttonClasses}
      style={customStyles}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
