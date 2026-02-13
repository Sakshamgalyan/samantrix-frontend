"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  label?: React.ReactNode;
  placeholder?: string;
  helperText?: string;
  size?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  variant?: "default" | "outlined" | "filled";
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local";
  isDisabled?: boolean;
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  borderColor?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  helperText,
  size = "md",
  fullWidth = false,
  variant = "outlined",
  type = "text",
  isDisabled = false,
  hasError = false,
  leftIcon,
  onLeftIconClick,
  rightIcon,
  onRightIconClick,
  value,
  onChange,
  borderRadius = "md",
  borderColor,
  className = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Size classes
  const sizeClasses: Record<string, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Border radius classes
  const borderRadiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Variant styles with forest color scheme
  const variantClasses: Record<string, string> = {
    default: "border-0 bg-transparent border-b-2 rounded-none",
    outlined: "border-2 bg-white",
    filled: "border-0 bg-forest-50",
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (borderColor) return borderColor;
    if (hasError) return "border-red-500";
    if (isFocused) return "border-forest-700";
    return "border-forest-300";
  };

  // Get focus ring
  const getFocusRing = () => {
    if (hasError) return "focus:ring-red-500";
    return "focus:ring-forest-700";
  };

  // Input classes
  const inputClasses = [
    "w-full transition-all duration-200 outline-none",
    sizeClasses[size],
    variantClasses[variant],
    variant !== "filled" ? getBorderColor() : "",
    variant !== "default" ? borderRadiusClasses[borderRadius] : "",
    variant === "outlined" ? "focus:ring-2 focus:ring-offset-0" : "",
    variant === "outlined" ? getFocusRing() : "",
    leftIcon ? "pl-10" : "",
    rightIcon || type === "password" ? "pr-10" : "",
    isDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-text",
    hasError ? "text-red-900" : "text-forest-950",
    "placeholder:text-forest-300",
  ]
    .filter(Boolean)
    .join(" ");

  // Container classes
  const containerClasses = ["relative", fullWidth ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");

  // Label classes
  const labelClasses = [
    "block text-sm font-medium mb-1",
    hasError ? "text-red-600" : "text-forest-900",
    isDisabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Helper text classes
  const helperTextClasses = [
    "text-xs mt-1",
    hasError ? "text-red-600" : "text-forest-700",
  ]
    .filter(Boolean)
    .join(" ");

  // Icon classes
  const iconClasses = [
    "absolute top-1/2 -translate-y-1/2",
    "text-forest-700",
    isDisabled ? "opacity-50" : "",
  ].join(" ");

  const actualType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={containerClasses}>
      {label && <label className={labelClasses}>{label}</label>}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div
            className={`${iconClasses} left-3 ${onLeftIconClick ? "cursor-pointer" : ""}`}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          {...rest}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Right Icon or Password Toggle */}
        {type === "password" ? (
          <div
            className={`${iconClasses} right-3 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        ) : rightIcon ? (
          <div
            className={`${iconClasses} right-3 ${onRightIconClick ? "cursor-pointer" : ""}`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        ) : null}

        {/* Error Icon */}
        {hasError && !rightIcon && type !== "password" && (
          <div className={`${iconClasses} right-3`}>
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

export default Input;
