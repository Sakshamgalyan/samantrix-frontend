"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { forwardRef } from "react";

export interface CheckboxProps {
  /** Size of the checkbox */
  size?: "sm" | "md" | "lg";
  /** Label text or React node */
  label?: string | React.ReactNode;
  /** Checked state */
  checked?: boolean;
  /** Visual variant */
  variant?: "default" | "bordered" | "filled";
  /** Indeterminate state (partial selection) */
  indeterminate?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Name attribute for form */
  name?: string;
  /** Value attribute for form */
  value?: string;
  /** Change handler */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Additional CSS classes */
  className?: string;
  /** Helper text below checkbox */
  helperText?: string;
  /** Error state */
  hasError?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Description text */
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      label,
      checked = false,
      variant = "default",
      indeterminate = false,
      disabled = false,
      required = false,
      name,
      value,
      onChange,
      className = "",
      helperText,
      hasError = false,
      errorMessage,
      description,
    },
    ref,
  ) => {
    // Size configuration
    const sizeClasses = {
      sm: {
        box: "w-4 h-4",
        icon: 12,
        label: "text-sm",
        gap: "gap-2",
      },
      md: {
        box: "w-5 h-5",
        icon: 16,
        label: "text-base",
        gap: "gap-2.5",
      },
      lg: {
        box: "w-6 h-6",
        icon: 18,
        label: "text-lg",
        gap: "gap-3",
      },
    };

    const sizeConfig = sizeClasses[size];

    // Variant styles
    const getVariantClasses = () => {
      if (disabled) {
        return "bg-forest-50 border-2 border-forest-300 cursor-not-allowed opacity-60";
      }

      if (hasError) {
        return "border-2 border-red-500 bg-red-50";
      }

      const baseClasses = "border-2 transition-all duration-200";

      switch (variant) {
        case "bordered":
          return `${baseClasses} ${
            checked || indeterminate
              ? "bg-forest-700 border-forest-700 shadow-sm"
              : "bg-white border-forest-300 hover:border-forest-700"
          }`;
        case "filled":
          return `${baseClasses} ${
            checked || indeterminate
              ? "bg-forest-800 border-forest-800 shadow-md"
              : "bg-forest-50 border-forest-300 hover:border-forest-700 hover:bg-forest-100"
          }`;
        case "default":
        default:
          return `${baseClasses} ${
            checked || indeterminate
              ? "bg-forest-700 border-forest-700"
              : "bg-white border-forest-300 hover:border-forest-700"
          }`;
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(event.target.checked, event);
      }
    };

    return (
      <div className={`inline-flex flex-col ${className}`}>
        <label
          className={`inline-flex items-start ${sizeConfig.gap} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              name={name}
              value={value}
              className="sr-only"
            />
            <motion.div
              className={`${sizeConfig.box} rounded flex items-center justify-center ${getVariantClasses()}`}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              whileHover={!disabled ? { scale: 1.05 } : {}}
            >
              <AnimatePresence mode="wait">
                {(checked || indeterminate) && (
                  <motion.div
                    key={indeterminate ? "indeterminate" : "checked"}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    {indeterminate ? (
                      <Minus
                        size={sizeConfig.icon}
                        className="text-white stroke-[3]"
                      />
                    ) : (
                      <Check
                        size={sizeConfig.icon}
                        className="text-white stroke-[3]"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {label && (
            <div className="flex flex-col">
              <span
                className={`${sizeConfig.label} ${
                  disabled
                    ? "text-forest-300"
                    : hasError
                      ? "text-red-700"
                      : "text-forest-950"
                } font-medium`}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {description && (
                <span className="text-sm text-forest-700 mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div className="ml-7 mt-1">
            {hasError && errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : (
              helperText && (
                <p className="text-sm text-forest-700">{helperText}</p>
              )
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
