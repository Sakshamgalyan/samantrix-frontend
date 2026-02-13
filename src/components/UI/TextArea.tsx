"use client";

import React, { forwardRef } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "onChange" | "value" | "defaultValue"
> {
  label?: string;
  helperText?: string;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  rows?: number;
  variant?: "outlined" | "filled" | "flushed";
  hasError?: boolean;
  hasDisabled?: boolean;
  hasSuccess?: boolean;
  isRequired?: boolean;
  borderRadius?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      size = "medium",
      fullWidth = false,
      rows = 4,
      variant = "outlined",
      hasError = false,
      hasDisabled = false,
      hasSuccess = false,
      isRequired = false,
      borderRadius = "md",
      className = "",
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    // Size classes
    const sizeClasses: Record<string, string> = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-5 py-3 text-lg",
    };

    // Border radius classes
    const borderRadiusClasses: Record<string, string> = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-3xl", // TextArea shouldn't be fully round usually
    };

    // Variant styles
    const variantClasses: Record<string, string> = {
      outlined: "border-2 bg-white",
      filled: "border-0 bg-forest-50 focus:bg-white focus:border-2",
      flushed: "border-0 bg-transparent border-b-2 rounded-none px-0",
    };

    // State based border colors
    const getBorderColor = () => {
      if (hasError) return "border-red-500 focus:border-red-500";
      if (hasSuccess) return "border-forest-600 focus:border-forest-600";
      if (hasDisabled) return "border-gray-200";
      return "border-forest-200 focus:border-forest-700";
    };

    const getFocusRing = () => {
      if (variant !== "outlined") return ""; // Only outlined gets ring usually, or specific styles
      if (hasError)
        return "focus:ring-2 focus:ring-red-200 focus:ring-offset-0";
      if (hasSuccess)
        return "focus:ring-2 focus:ring-forest-200 focus:ring-offset-0";
      return "focus:ring-2 focus:ring-forest-100 focus:ring-offset-0";
    };

    const textareaClasses = [
      "transition-all duration-200 outline-none block",
      fullWidth ? "w-full" : "",
      sizeClasses[size],
      variantClasses[variant],
      variant === "outlined" || variant === "flushed" ? getBorderColor() : "",
      variant !== "flushed"
        ? borderRadiusClasses[borderRadius] || `rounded-${borderRadius}`
        : "",
      getFocusRing(),
      hasDisabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "cursor-text",
      hasError
        ? "text-red-900 placeholder:text-red-300"
        : "text-forest-950 placeholder:text-forest-300",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const labelClasses = [
      "block text-sm font-medium mb-1.5",
      hasError
        ? "text-red-600"
        : hasSuccess
          ? "text-forest-700"
          : "text-forest-900",
      hasDisabled ? "opacity-60" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const helperTextClasses = [
      "text-xs mt-1.5",
      hasError
        ? "text-red-600"
        : hasSuccess
          ? "text-forest-600"
          : "text-forest-500",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={`${fullWidth ? "w-full" : "inline-block"} ${hasDisabled ? "opacity-80" : ""}`}
      >
        {label && (
          <label className={labelClasses}>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            disabled={hasDisabled}
            className={textareaClasses}
            value={value}
            onChange={onChange}
            {...props}
          />

          {/* Status Icons */}
          {(hasError || hasSuccess) && (
            <div className="absolute top-3 right-3 pointer-events-none">
              {hasError && <AlertCircle size={18} className="text-red-500" />}
              {hasSuccess && (
                <CheckCircle size={18} className="text-forest-600" />
              )}
            </div>
          )}
        </div>

        {helperText && <p className={helperTextClasses}>{helperText}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
